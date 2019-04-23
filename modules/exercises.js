// const { promisify } = require('util');
// const request = promisify(require("request"));
const fetch = require('node-fetch');
const cheerio = require("cheerio");

const utils = require("../utils/utils");
const Chatwait = require('../utils/chatwait');
const papago = require('../utils/papago');

const references = require("../data/references.json");
const { exerciseTimeLimit: timeLimit } = require('../data/config.json');

const URLMask = "http://urlecho.appspot.com/echo?body=<center"
    + "%20style=\"font-size:%2070\">Don't+try+to+copy+the+"
    + "Hangul+from+the+link.</center>";

exports['kp, ㅋ'] = async message =>
{
    const character = utils.randomElement(references.hangul.split(','));
    const image = 'http://en.morekorea.net/program/font.php?fontsize=' + 
        `41&fonttype=1&hangul=${character}`

    const embed = message.response.embed('⌨ Type this Hangul character:', '‍')
        .setThumbnail(image)
        .setURL(URLMask);
    
    message.channel.send(embed);
    checkAnswer(message, character);
}

exports['kpw, ㅋㄷ'] = async message =>
{
    message.channel.startTyping();

    const url = 'https://www.bestrandoms.com/random-korean-words';
    const response = await fetch(url)
        .then(data => data.text())
        .catch(console.error);
        
    if(!response)
        return message.channel.send(message.response
            .problem('Woops. An error occurred.'));

    message.channel.stopTyping(true);

    const $ = cheerio.load(response);
    $('.col-xs-12').each(async (i, el) => 
    {
        if(i === 1)
        {
            const word = $(el)
                .children(".text-center.font-18")
                .children("span")
                .text();

            message.channel.send(message.response
                .embed('⌨ Type this word:')
                .setImage(wordToImage(word)));

            let meaning = await checkDictionary(word);
            meaning = meaning.dictionary.fromLanguage.items.shift().pos
                .shift().meanings.reduce((meanings, m) => 
                    `${meanings}• ${m.meaning}\n`, '');

            meaning = `It means...\n${meaning}`;
            checkAnswer(message, word, meaning);
        }
    });
}

exports['noun, ㅁㅅ'] = message => translate(message, references.nouns);
exports['verb, ㄷㅅ'] = message => translate(message, references.verbs);
exports['phrase, ㄱㅈ'] = message => translate(message, references.phrases);
exports['nnum, ㅎㅅ'] = message => translate(message, references.numbers.native);
exports['snum, ㅈㅅ'] = message => translate(message, references.numbers.sino);

exports['conjugate, ㅎㅇ'] = async message =>
{
    const verb = utils.randomElement(references.verbs);
    const conjugations = verb.conjugation;
    
    if(!conjugations) 
        return this.conjugate(message);
    else if(Object.values(conjugations).length === 0)
        return this.conjugate(message);

    const conjugation = utils.randomElement(Object.keys(conjugations));
    let conjugationText = `**${conjugation.split(' ').reduce((text, c) => 
            `${text}${c.charAt(0).toUpperCase()}${c.substr(1)} `, '')}**`;

    message.channel.send(message.response
        .embed(`📝 Conjugate this verb into...`, conjugationText)
        .setImage(wordToImage(verb.text)));

    checkAnswer(message, conjugations[conjugation].split('|'));
}

async function translate(message, list)
{
    const word = utils.randomElement(list);

    message.channel.send(message.response
        .embed('🌐 Translate this to English...')
        .setImage(wordToImage(word.text)));

    checkAnswer(message, word.meaning.split('|'), word.notes);
}

async function checkAnswer(message, answer, info)
{
    const disabled = message.client.commands.disabled;
    disabled.push(message.author.id);

    const answered = await new Chatwait(message, timeLimit)
        .checkFor(answer, _ => message.channel
            .send(message.author, message.response
                .embed('❌ Wrong! Try again.')));

    disabled.splice(disabled.indexOf(message.author.id));

    let response = answered? '✅ Correct' : "⏰ Time's up!";
    message.channel.send(message.author, message.response
        .embed(response, info));
}

const wordToImage = word => 'http://en.morekorea.net/program/font.php?hangul='
    + `${word.replace(/\s/g, '+')}`;

const checkDictionary = async word => await papago
    .from(papago.Korean)
    .to(papago.English)
    .toJSON()
    .translate(word)
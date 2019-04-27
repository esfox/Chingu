const papago = require('../utils/papago');
const utils = require('../utils/utils');

const englishLetters = 
[ 
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z',
]

exports['translate, ㅂ'] = async message =>
{
    let text = message.parameters;
    if(!text)
        return message.channel.send(message.response
            .problem('Please include the text to translate.'));

    text = utils.cleanString(text);
    text = await usePapago(message, text);
    message.channel.send(message.response
        .embed('🌐 Translation', text)
        .setFooter('Translation by papago.com', 
            'https://i.imgur.com/3x3h8hm.png'));
}

exports['dictionary, ㅅㅈ'] = async message =>
{
    let text = message.parameters;
    if(!text)
        return message.channel.send(message.response
            .problem('Please include the word to search in the dictionary.'));
            
    text = utils.cleanString(text);

    if(text.split(' ').length > 1)
        return message.channel.send(message.response
            .problem('Please include only 1 word.'));

    text = await usePapago(message, text, true);

    let dictionary = text.dictionary.fromLanguage;
    if(!dictionary)
        return message.channel.send(message.response
            .problem("Can't find that word in the dictionary."));

    dictionary = dictionary.items.shift();
    
    const word = dictionary.entry.replace(/<b>|<\/b>/g, '');
    const meanings = dictionary.pos.shift().meanings
        .reduce((meanings, m) => `${meanings}• ${m.meaning}\n`, '') + 
        '\nSee more results in https://endic.naver.com/search.nhn?sLn=en&'
            + `query=${text}`;
    
    message.channel.send(message.response.embed(word, meanings)
        .setFooter('from endic.naver.com', 'https://i.imgur.com/VQ4Zm0h.jpg'));
}

const usePapago = async (message, text, getObject) =>
{
    message.channel.startTyping();

    const isKorean = !isEnglish(text);
    text = await papago
        .from(isKorean? papago.Korean : papago.English)
        .to(isKorean? papago.English : papago.Korean)
        .toJSON(getObject || false)
        .translate(text);

    message.channel.stopTyping(true);

    return text;
}

const isEnglish = text => englishLetters.some(l => 
    text.toLowerCase().includes(l));
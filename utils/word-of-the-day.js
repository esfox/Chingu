const Discord = require('discord.js');
const { embedColor, teacherChannel } = require('../data/config.json');
const { readFileSync, writeFileSync } = require('fs');

function getWords()
{
  const words = readFileSync('./data/wotd.json', 'utf8');
  return JSON.parse(words);
}

function saveWords(words)
{
  writeFileSync('./data/wotd.json', JSON.stringify(words, null, 2));
}

exports.get = () => getWords();
exports.save = words => saveWords(words);
exports.post = (bot, data) =>
{
  const words = getWords();
  words.push(data);
  saveWords(words);

  const
  {
    word,
    romanization,
    translation,
    example_sentence,
    example_translation,
    test_translation,
  } = data;

  const embed = new Discord.RichEmbed()
    .setColor(embedColor)
    .setTitle('📌  Word of the Day Added')
    .addField('Word', word, true)
    .addField('Romanization', romanization, true)
    .addField('Translation', translation, true)
    .addField('Example Sentence', example_sentence)
    .addField('Example Sentence Translation', example_translation)
    .addField('Test Translation', test_translation);

  bot.channels.get(teacherChannel).send(embed);
}

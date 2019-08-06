const Discord = require('discord.js');
const { embedColor } = require('../data/config.json');
const { readFileSync, writeFileSync } = require('fs');

function getWords()
{
  const words = readFileSync('./data/wotd.json', 'utf8');
  return JSON.parse(words);
}

function saveWord(word)
{
  const words = getWords();
  words.push(word);
  writeFileSync('./data/wotd.json', JSON.stringify(words, null, 2));
}

class Handler
{
  constructor(bot)
  {
    this.bot = bot
  }

  get()
  {
    return getWords();
  }

  add(data)
  {
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
  
    saveWord(data);
  
    this.bot.users.get('247955535620472844').send(embed);
  }
}

module.exports = bot => new Handler(bot);

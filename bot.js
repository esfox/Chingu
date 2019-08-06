const Discord = require('discord.js');
const bot = new Discord.Client();
require('./server').init(bot);

const fs = require('fs');
const config = require('./data/config.json');
const database = require('./data/database');
const commands = require('./utils/commands');
const reminder = require('./utils/reminder');
const wordOfTheDay = require('./utils/word-of-the-day');

const args = process.argv.slice(2).shift();
bot
	.login(process.env.TOKEN || args)
	.catch(error => { if(error) console.log('gitgud haha') });

bot.on('ready', async _ =>
{
	await database.init();
	console.log('Bot Started');

	reminder.startWordReminder(remindWordOfTheDay);
	console.log(`Started Word of the Day reminder.\n(${new Date()})`);
});

commands.addModules(fs.readdirSync('./modules')
	.filter(file =>
		file.indexOf('.') !== 0 &&
		file.slice(-3) === '.js')
	.map(file => require(`./modules/${file}`)));

bot.commands = commands;

bot.on('message', message =>
{
	commands.handle(message);

	if(message.content === '?goodbot')
		return message.channel.send('Me? 😏');
});

function remindWordOfTheDay()
{
	const embed = new Discord.RichEmbed()
		.setColor(config.embedColor)
		.setTitle('🔔 Word of the Day Reminder');

	const words = wordOfTheDay.get();
	if(words.length === 0)
	{
		embed.setDescription("**There is no next word of the day!**");
		return send();
	}

  const
  {
    word,
    romanization,
    translation,
    example_sentence,
    example_translation,
    test_translation,
  } = words.shift();
	wordOfTheDay.save(words);

	const post = '@everyone\n'
		+ `${word} ||\`${romanization}\`|| = __**${translation}**__\n`
		+ `Example Sentence:\n${example_sentence}\n\n`
		+ `"${example_translation}"`
		+ `Test Translation:\n${test_translation}\n\n`
		+ 'Practice translating it in #study-chat!';

	embed
		.addField('Next Word...', `**${word}** = ${translation}`)
		.addField('Post Text', '```' + post + '```')
		.setFooter(`${words.length} words saved.`);

	send();

	function send()
	{
		bot.channels.get('385956869077860352')
			.send(`<@&${config.teacher}>`, embed)
			.catch(console.error);
	}
}
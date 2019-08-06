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

	const data = words.shift();
	fs.writeFileSync(`./data/wotd.json`, JSON.stringify(words, null, '\t'));

	if(error)
		return console.error(error);

	embed.addField('Next Word...', `${data.word}`
		+ ` = ${data.meaning}`);
	embed.addField('Post Text', '```' + data.post + '```');
	embed.setFooter(`${words.length} words saved.`);

	send();

	function send()
	{
		bot.channels.get('385956869077860352')
			.send(`<@&${config.teacher}>`, embed)
			.catch(console.error);
	}
}
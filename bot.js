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
	.catch(console.error);

reminder.startWordReminder(remindWordOfTheDay);

bot.on('ready', async _ =>
{
	await database.init();
	console.log('Bot Started');

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

	if(message.content === '---test')
	{
		const mobilePost = '@everyone\n'
			+ `WORD \\|\\|\\\`ROMANIZATION\\\`\\|\\| = \\_\\_\\*\\*TRANSLATION\\*\\*\\_\\_\n\n`
			+ `Example sentence:\nEXAMPLE_SENTENCE\n`
			+ `"EXAMPLE_TRANSLATION"\n\n`
			+ `Test translation:\nTEST_TRANSLATION\n\n`
			+ 'Practice translating it in #study-chat!';

		message.channel.send(mobilePost);
	}
});

function remindWordOfTheDay()
{

	const words = wordOfTheDay.get();
	if(words.length === 0)
		return send('@everyone\n**There is no next word of the day!**');
		// embed.setDescription("**There is no next word of the day!**");
  
	const embed = new Discord.RichEmbed()
		.setColor(config.embedColor)
		.setTitle('🔔 Word of the Day Reminder');

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
		
	// const post = '@everyone\n'
	// 	+ `${word} ||\`${romanization}\`|| = __**${translation}**__\n\n`
	// 	+ `Example sentence:\n${example_sentence}\n`
	// 	+ `"${example_translation}"\n\n`
	// 	+ `Test translation:\n${test_translation}\n\n`
	// 	+ 'Practice translating it in #study-chat!';

	embed
		.addField('Next Word...', `**${word}** = ${translation}`)
		// .addField('Post Text', '```' + post + '```')
		.setFooter(`${words.length} words saved.`);

	send(embed);

	const post = '\\@everyone\n'
		+ `${word} \\|\\|\\\`${romanization}\\\`\\|\\|`
	  + ` = \\_\\_\\*\\*${translation}\\*\\*\\_\\_\n\n`
		+ `Example sentence:\n${example_sentence}\n`
		+ `"${example_translation}"\n\n`
		+ `Test translation:\n${test_translation}\n\n`
		+ 'Practice translating it in #study-chat!';

	send(post);

	function send(content)
	{
		bot.channels.get(config.teacherChannel)
			.send(/* `<@&${config.teacher}> <@&${config.mentor}>`,  */content)
			.catch(console.error);
	}
}
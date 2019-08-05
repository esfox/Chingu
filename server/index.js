const Discord = require('discord.js');
const { embedColor } = require('../data/config.json');

const http = require('http');
const express = require('express');
const bodyparser = require('body-parser');
const app = express();

app.use(express.json());
app.get("/", (_, response) =>
{
	console.log(Date.now() + " Ping Received");
	response.sendStatus(200);
});

app.use(express.static('server/website'));
app.get('/wotd', (request, response) =>
	response.sendFile(__dirname + '/website/index.html'));

exports.init = bot =>
{
	app.post('/wotd', (request, response) =>
	{
		const
		{
			word,
			romanization,
			translation,
			example_sentence,
			example_translation,
			test_translation,
		} = request.body;

		const embed = new Discord.RichEmbed()
			.setColor(embedColor)
			.setTitle('📌  Word of the Day Added')
			.addField('Word', word, true)
			.addField('Romanization', romanization, true)
			.addField('Translation', translation, true)
			.addField('Example Sentence', example_sentence)
			.addField('Example Sentence Translation', example_translation)
			.addField('Test Translation', test_translation);

		bot.users.get('247955535620472844').send(embed);

		response.sendStatus(200);
	});

	start();
}

function start()
{
	app.listen(process.env.PORT);
	
	setInterval(() =>
	{
		http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
	}, 280000);
}

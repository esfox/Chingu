const wordOfTheDay = require('../utils/word-of-the-day');

const http = require('http');
const express = require('express');
const app = express();

app.use(express.json());
app.get("/", (_, response) =>
{
	console.log(Date.now() + " Ping Received");
	response.sendStatus(200);
});

app.use(express.static('server/website'));
app.get('/%EC%83%88%EB%8B%A8%EC%96%B4', (request, response) =>
	response.sendFile(__dirname + '/website/index.html'));

exports.init = bot =>
{
	app.post('/wotd', (request, response) =>
	{
		wordOfTheDay.add(request.body);
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

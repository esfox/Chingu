const wordOfTheDay = require('../utils/word-of-the-day');

// const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('server/website'));

exports.init = bot =>
{
	app.get("/", (_, response) =>
	{
		console.log(Date.now() + " Ping Received");
    response.status(200).send('hi');
	});
	
	app.get('/add-wotd', (_, response) =>
		response.sendFile(__dirname + '/website/wotd.html'));

	app.get('/wotd', (_, response) =>
		response.status(200).send(wordOfTheDay.get()));

	app.post('/wotd', (request, response) =>
	{
		wordOfTheDay.post(bot, request.body);
		response.sendStatus(200);
	});

	start();
}

function start()
{
	const port = 1680;
	app.listen(port);
	console.log(`API Server listening on port ${port}`);
	
	// setInterval(() =>
	// {
	// 	http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
	// }, 280000);
}

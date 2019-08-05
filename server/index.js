const http = require('http');
const express = require('express');
const bodyparser = require('body-parser');
const app = express();

app.get("/", (_, response) =>
{
	console.log(Date.now() + " Ping Received");
	response.sendStatus(200);
});

app.use(express.json());
app.use(express.static('server/website'));
app.get('/wotd', (request, response) =>
	response.sendFile(__dirname + '/website/index.html'));

exports.init = bot =>
{
	app.post('/wotd', (request, response) =>
	{
		console.log(request);
		console.log(request.body.word);
		bot.users.get('247955535620472844').send('received wotd');
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

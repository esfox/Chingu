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
		bot.users.get('247955535620472844')
			.send(JSON.stringify(request.body, null, 2));
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

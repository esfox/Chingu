const http = require('http');
const express = require('express');
const app = express();
app.get("/", (_, response) =>
{
	console.log(Date.now() + " Ping Received");
	response.sendStatus(200);
});

// app.use(express.static('/website'));
app.get('/wotd', (request, response) =>
	response.sendFile(__dirname + '/website/index.html'));

app.listen(process.env.PORT);

setInterval(() =>
{
	http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);	
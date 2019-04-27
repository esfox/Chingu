const http = require('http');  
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const Discord = require('discord.js')
const bot = new Discord.Client();

const fs = require('fs');
const database = require('./data/database');
const commands = require('./utils/commands');
const reminder = require('./utils/reminder');

const data = require('./data/data.json');
const config = require('./data/config.json');

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

    const words = data.daily_words;
    if(words.length === 0)
    {
        embed.setDescription("**There's no next word of the day!**");
        return send();
    }

    const wordData = words.shift();
    fs.writeFile(`./data/data.json`, JSON.stringify(data, null, '\t'), 
        error =>
        {
            if(error) 
                return console.error(error);

            embed.addField('Next Word...', `${wordData.word}`
                + ` = ${wordData.meaning}`);
            embed.addField('Post Text', '```' + wordData.post + '```');
            embed.setFooter(`${words.length} words saved.`);
                
            send();
        });

    function send()
    {
        bot.channels.get('385956869077860352')
            .send(`<@&${config.teacher}>`, embed)
            .catch(console.error);
    }
}
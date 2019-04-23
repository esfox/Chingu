const Discord = require('discord.js');
const utils = require('./utils');
const config = require('../data/config.json');

exports.makeEmbed = (title, description) =>
{
    const embed = new Discord.RichEmbed()
        .setColor('#00C751');

    if(title && description) embed.addField(title, description);
    else
    {
        if(title) embed.setTitle(title);
        if(description) embed.setDescription(description);
    }

    return embed;
}

exports.randomElement = array =>
    array[Math.floor(Math.random() * array.length)];

exports.cleanString = string => string
    .replace(/\s\s+/g, ' ')
    .trim();

const months = 
[ 
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
];

exports.parseDate = date =>
{
    date = new Date(date);
    return `${months[date.getMonth()]} ${date.getDate()}`
        + `, ${date.getFullYear()}`;
}

exports.old_parseDate = (date) =>
{
    let [ month, day, year ] = date.split('/');
    month = months[month - 1];
    return `${month} ${day}, ${year}`;
}

exports.compareDate = (date, toCompare) =>
{
    const monthShortcut = month => month.substr(0, 3).toLowerCase();

    let parsedDate = this.old_parseDate(date);
    let [ month, day, year ] = parsedDate.split(' ');
    let [ part1, ...part2 ] = toCompare.split(' ');
    
    if(months.some(m => monthShortcut(m).match(part1.toLowerCase())))
    {
        month = monthShortcut(month);
        part1 = monthShortcut(part1);
    }
    
    toCompare = `${part1} ${part2}`.toLowerCase();
    parsedDate = `${month} ${day} ${year}`.toLowerCase();

    return parsedDate.match(toCompare) ||
        date.match(toCompare.replace(/-/g, '/'));
}
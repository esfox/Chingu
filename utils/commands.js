const Discord = require("discord.js");

const config = require('../data/config.json');

const developer = '247955535620472844';

let { prefix, embedColor } = config;

const modules = [];
const disabled = [];

exports.addModule = _module => modules.push(_module);
exports.addModules = _modules => modules.push.apply(modules, _modules);

exports.handle = (message) =>
{
    if(message.author.bot)
        return;

    if(disabled.includes(message.author.id))
        return;

    let chat = message.content;
    if(!chat.startsWith(prefix)) 
        return;

    chat = chat.substr(prefix.length).split(' ');
    let [ keyword, ...parameters ] = chat;
    parameters = parameters.length >= 1? parameters.join(' ') : undefined;

    message.client.developer = developer;
    message.parameters = parameters;

    message.response = {};
    message.response.embed = embed;
    message.response.problem = problem;

    for(let m of modules)
    {
        let isClass = m.prototype !== undefined;

        const command = Object.getOwnPropertyNames(isClass? m.prototype : m)
            .find(f => f === keyword || 
                f.replace(/\s/g, '').split(',').includes(keyword));

        if(!command)
            continue;

        if(isClass)
            new m(message)[command]();
        else
            m[command](message);

        break;
    }
}

exports.disabled = disabled;

function problem(title, description)
{
    return embed(`❌  ${title}`, description);
}

function embed(title, description)
{
    const embed = new Discord.RichEmbed().setColor(embedColor);

    if(title && description) 
        return embed.addField(title, description);

    if(title) embed.setTitle(title);
    if(description) embed.setDescription(description);

    return embed;
}
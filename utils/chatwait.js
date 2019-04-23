const Discord = require('discord.js');

module.exports = class
{
    constructor(message, duration)
    {
        if(!message)
            throw new Error('Please include the message object.');

        if(!duration)
            throw new Error('Please include the duration.');

        this.message = message;
        this.duration = duration;
    }

    checkFor(expected, unexpectedCallback)
    {
        return new Promise
        (success =>
        {
            let gotExpected = false;
    
            const collector = new Discord.MessageCollector
            (
                this.message.channel, 
                m => m.author.id === this.message.author.id,
                { time: this.duration }
            );
    
            collector.on('collect', message => 
            {
                let chat = message.content;
    
                chat = simplify(chat);

                gotExpected = Array.isArray(expected)?
                    expected.map(e => simplify(e)).includes(chat) :
                    simplify(expected) === chat;
    
                if(gotExpected)
                {
                    collector.stop();
                    success(true);
                }
    
                if(!gotExpected && unexpectedCallback)
                    unexpectedCallback(chat);
            });
    
            collector.on('end', _ =>
            {
                if(!gotExpected) 
                    success(false);
            });
        });
    }
}

function simplify(text)
{
    return text.toLowerCase().replace(/\s|\.|\?|\!|\'/g, '').trim();
}
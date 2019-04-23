// TODO: make generic and reusable
module.exports = class
{
    async send(message, content, pages)
    {
        if(!Array.isArray(pages))
            throw new Error('The page contents should be an array of data.');

        this.author = message.author.id;
        this.pages = pages;
        this.page = 0;

        this.content = content || message.response.embed();
        this.content.setDescription(pages[this.page]);

        if(pages.length > 1)
        {
            this.content.setFooter('Press an arrow to change the page.');
            this.message = await message.author.send(this.content);
            await this.react();
            this.wait();
        }
        else await message.author.send(this.content);
    }

    async wait()
    {
        const reactions = await this.message.awaitReactions((reaction, user) => 
            user.id === this.author &&
            [ '⬅', '➡' ].includes(reaction.emoji.name),
            { 
                max: 1,
                time: 30000
            });

        if(!reactions || reactions.size === 0)
        {
            this.message.reactions.filter(r => r.me)
                .forEach(async r =>  await r.remove());

            this.content.footer = undefined;
            this.message.edit(this.content);
            return Promise.resolve();
        }

        const reaction = reactions.first().emoji.name;
        if(reaction === '➡')
            this.next();
        if(reaction === '⬅')
            this.previous();
    }

    async change()
    {
        await this.resend();
        await this.react();
        this.wait();
    }

    async resend()
    {
        this.message = await this.message.delete().catch(_ => {});
        this.content.setDescription(this.pages[this.page]);
        this.message = await this.message.channel.send(this.content);
    }

    async react()
    {
        if(this.page !== 0)
            await this.message.react('⬅');

        if(this.page < this.pages.length - 1)
            await this.message.react('➡');
    }

    next()
    {
        this.page++;
        this.change();
    }

    previous()
    {
        this.page--;
        this.change();
    }
}
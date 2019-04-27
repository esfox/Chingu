const utils = require('../utils/utils');
const database = require('../data/database');
const PagedEmbed = require('../utils/paged-embed');

module.exports = class
{
    constructor(message)
    {
        this.message = message;
        this.send = new Send(message);
    }

    async ['note, ㄴ']()
    {   
        const message = this.message;

        if(!message.parameters)
            return this.send.missing('note');

        const note = message.parameters.trim();

        if(note.length > 360)
            return this.send.problem('Please do not exceed 360 characters');

        const saved = await database.addNote(message.author.id, note)
            .catch(response => this.send.problem(response));

        if(!saved)
            return;

        this.send.embed('✅  Saved note in your Notebook.');
    }

    async ['notebook, ㄱㅊ']()
    {
        const message = this.message;

        let notes = await database.getUserNotes(message.author.id)
            .catch(response => this.send.problem(response));

        if(!notes)
            return;

        const embed = message.response
            .embed(`📒  You have ${notes.length} notes`);
        await new PagedEmbed().send(message, embed, parseNotes(notes));

        if(message.channel.type !== 'dm')
            this.send.embed('✉  Please check my DM.');
    }

    // TODO: Search by date
    async ['nfind, ㄴㅊ']()
    {
        const message = this.message;

        let parameters = message.parameters;
        if(!parameters)
            return this.send.missing('text to search.');

        parameters = utils.cleanString(parameters);
        let found = await database.findNotes(message.author.id, parameters)
            .catch(response => this.send.problem(response));

        if(!found)
            return;

        const embed = message.response.embed(`🔎  Found ${found.length}`
            + ` ${found.length > 1? 'Notes' : 'Note'}`);
        await new PagedEmbed().send(message, embed, parseNotes(found));

        if(message.channel.type !== 'dm')
            this.send.embed('✉  Please check my DM.');
    }
    
    async ['nedit, ㄴㅂ']()
    {
        const message = this.message;

        let parameters = message.parameters;
        if(!parameters)
            return this.send.noNumber();

        parameters = parameters.match(/\s\s+/)? 
            parameters.substr(extraSpaces.shift().length) :
            parameters.split(' ');
        
        let [ number, ...note ] = parameters;
        note = note.length === 0? undefined : note.join(' ').trim();

        if(isNaN(number))
            return this.send.noNumber();

        if(!note)
            return this.send.missing('new note');

        const saved = await database
            .updateNote(message.author.id, number, note)
            .catch(response => this.send.problem(response));

        if(!saved)
            return;

        this.send.embed('✏  Edited your note.');
    }

    async ['ndelete, ㄴㅅ']()
    {
        const message = this.message;
        
        let parameters = message.parameters;
        if(!parameters)
            return this.send.noNumber();

        let numbers = utils.cleanString(parameters).split(' ');

        if(numbers.every(n => isNaN(n)))
            return this.send.noNumber();

        numbers = numbers
            .filter(n => !isNaN(n))
            .map(n => parseInt(n));

        const deleted = await database.deleteNote(message.author.id, numbers)
            .catch(response => this.send.problem(response));

        if(!deleted)
            return;

        this.send.embed(`🗑  ${numbers.length > 1? 
            'Notes' : 'Note'} deleted.`);
    }
}

class Send
{
    constructor(message)
    {
        this.message = message;
    }

    embed(response)
    {
        this.message.channel.send(this.message.response.embed(response));
    }

    problem(response)
    {
        this.message.channel.send(this.message.response.problem(response));
    }

    missing(missing)
    {
        this.problem(`Please include the ${missing}.`);
    }

    noNumber()
    {
        this.missing('note number');
    }
}

const parseNotes = notes => notes
    .reduce((parts, item, i) =>
    { 
        if(!item.number)
            item.number = i + 1;

        const part = Math.floor(i / 5);
        
        if(!parts[part])
            parts[part] = [];
        
        parts[part].push(item);
        
        return parts;
    }, [])
    .map(part => part.reduce((results, note, i) => 
        `${results}**#${note.number? note.number : i + 1}** - `
        + `__${utils.parseDate(note.updatedAt)}__\n`
        + `${note.text}\n\n`, ''));


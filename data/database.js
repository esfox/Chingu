const Sequelize = require('sequelize');
const { Model, Op } = Sequelize;

const sequelize = new Sequelize
({
    dialect: 'sqlite',
    storage: './data/database.sqlite'
});

exports.init = _ => sequelize.sync()
    .then(_ => console.log('Connected to database.'))
    .catch(console.error);

class User extends Model {}User.init({ user_id: Sequelize.STRING }, 
{
    sequelize,
    underscored: true,
    timestamps: false
});

class Note extends Model {}
Note.init({ text: Sequelize.TEXT },
{
    sequelize,
    underscored: true
});

User.hasMany(Note);

exports.addNote = async (user, note) =>
{
    [ user ] = await User.findOrCreate({ where: { user_id: user } })
        .catch(console.error);

    if(!user)
        return problem('saving');

    [ note ] = await Note.findOrCreate({ where: { text: note } })
        .catch(console.error);

    if(!note)
        return problem('saving');

    user.addNote(note);

    return Promise.resolve(true);
}

exports.getUserNotes = async user =>
{
    user = await getUser(user)
        .catch(console.error);

    if(!user)
        return noneFound('notes yet');

    const notes = await user.getNotes();
    
    if(!notes || notes.length === 0)
        return noneFound('notes yet');

    

    return Promise.resolve(notes.map(n => n.dataValues));
}

exports.getUserNote = async (user, noteNumber) => 
{
    noteNumber--;

    const notes = await this.getUserNotes(user)
        .catch(ignore);

    if(!notes)
        return noneFound('notes yet');

    if(noteNumber >= notes.length)
        return noneFound('that note');

    return Promise.resolve(notes[noteNumber]);
}

exports.findNotes = async (user, query) =>
{
    user = await User.findOne({ where: { user_id: user } });
    
    if(!user)
        return noneFound('notes yet');

    let notes = await user.getNotes();
    if(!notes || notes.length === 0)
        return noneFound('notes yet');

    notes = notes
        .map(n => n.dataValues)
        .map((n, i) =>
        {
            n.number = i + 1
            return n;
        })
        .filter(n => n.text.includes(query));

    if(!notes || notes.length === 0)
        return Promise.reject(`Can't find "${query}" in your notebook.`);

    return Promise.resolve(notes);
}

exports.updateNote = async (user, number, update) =>
{
    let note = await this.getUserNote(user, number)
        .catch(ignore);

    if(!note)
        return noneFound('that note');

    note.text = update;

    const saved = await Note.update(note, { where: { id: note.id } });
    if(!saved)
        return problem('editing');

    return Promise.resolve(true);
}

exports.deleteNote = async (user, numbers) =>
{
    let notes = await this.getUserNotes(user)
        .catch(ignore);

    if(!notes)
        return noneFound('notes yet');

    notes = notes.filter((_, i) => numbers.includes(i + 1));
    if(notes.length === 0)
        return noneFound(numbers.length > 1? 'those notes' : 'that note');

    const deleted = await Note.destroy({ where: 
        { id: { [Op.in]: notes.map(n => n.id) } } });

    if(!deleted)
        return problem('deleting');
    
    return Promise.resolve(true);
}

const getUser = user_id => User.findOne({ where: { user_id } })
    .catch(console.error);

const noneFound = info => Promise.reject(`You don't have ${info}.`);
const problem = action => Promise.reject('A problem occurred'
    + ` in ${action} your note.`);

const ignore = _ => {}mm
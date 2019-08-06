const fs = require('fs');
const utils = require('../utils/utils');
const request = require('request');

const references = require('../data/references.json');
const config = require('../data/config.json');
const data = require('../data/data.json');

const types =
{
	명사: 'nouns',
	동사: 'verbs',
	구절: 'phrases'
};

module.exports = class
{
	constructor(message)
	{
		if(message.channel.type === 'dm')
			this.notTeacher = true;
		else
		{
			if(message.member.roles.every(r => r.id !== config.teacher))
			{
				this.notTeacher = true;
				message.channel.send(message.response
					.problem("You don't have permission to use this command."));
			}
		}

		this.message = message;
	}

	async 단어보기()
	{
		if(this.notTeacher)
			return;

		const message = this.message;

		const embed = message.response.embed('📖 Next Words of the Day');
		embed.setDescription(data.daily_words.reduce((text, w) =>
			`${text}• ${w.word} \`${w.pronunciation}\` - **${w.meaning}**\n`,
			''));

		message.channel.send(embed)
			.catch(console.error);
	}

	async 단어()
	{
		if(this.notTeacher)
			return;

		const message = this.message;
		const form = `https://${process.env.PROJECT_DOMAIN}.glitch.me/새단어`;
		message.channel.send(form);

		// let parameters = message.parameters;
		// if(!parameters)
		// 	return message.channel.send(message.response
		// 		.problem('Please include the word.'));

		// parameters = utils.cleanString(parameters);

		// let openParenthesis = parameters.indexOf('(');
		// let closeParenthesis = parameters.indexOf(')');

		// let pronunciation = parameters.match(/\(([^()]+)\)/g);
		// if(openParenthesis < 0 || closeParenthesis < 0 ||
		// 	pronunciation.length === 0)
		// 	return message.channel.send(message.response
		// 		.problem('Please include the pronunciation.'));

		// pronunciation = pronunciation.shift();
		// pronunciation = pronunciation.substr(1, pronunciation.length - 2);

		// let word = parameters.substr(0, openParenthesis).trim();
		// if(word.length === 0)
		// 	return message.channel.send(message.response
		// 		.problem('Please include the word.'));

		// if(word.split(' ').length > 1)
		// 	return message.channel.send(message.response
		// 		.problem('Please include one word only.'));

		// let meaning = parameters.substr(closeParenthesis + 1).trim();
		// if(meaning.length === 0)
		// 	return message.channel.send(message.response
		// 		.problem('Please include the meaning of the word.'));

		// if(data.daily_words.some(item => item.word === word))
		// 	return message.channel.send(message.response
		// 		.problem('That word is already included.'));

		// const post = `@everyone\n${word}`
		// 	+ ` ||\`${pronunciation}\`|| = __**${meaning}**__`;

		// data.daily_words.push({ word, pronunciation, meaning, post });

		// const saved = await saveData();
		// if(!saved)
		// 	return errorOccurred(message);

		// message.channel.send(message.response
		// 	.embed('✅  Added a new word of the day'));
	}

	ㅁㅈㄹ()
	{
		if(this.notTeacher)
			return;

		const message = this.message;

		const response = '📖  All References\n\n'
			+ Object.values(types).reduce((text, type) =>
				text + `__**${type.charAt(0).toUpperCase()
				+ type.substr(1)}**__\n`
				+ references[type].reduce((string, word) =>
					`${string}• ${word.text} - ${word.meaning
						.split('|').join(', ')}\n`, '') + '\n', '');

		message.channel.send(response, { split: true });
	}

	ㅅㅁㅅ() { addReference(this.message, references.nouns); }
	ㅅㄷㅅ() { addReference(this.message, references.verbs); }
	ㅅㄱㅈ() { addReference(this.message, references.phrases); }

	async ㅅㅎㅇ()
	{
		if(this.notTeacher)
			return;

		const message = this.message;

		let parameters = message.parameters;
		if(!parameters || parameters.length === 0 ||
			!parameters.includes('>') || !parameters.includes('='))
			return wrongFormat(message);

		parameters = utils.cleanString(parameters);

		const arrow = parameters.indexOf('>');
		const equal = parameters.indexOf('=');

		if(
			arrow < 0 ||
			equal < 0 ||
			arrow > equal ||
			parameters.match(/>/g).length > 2 ||
			parameters.match(/=/g).length > 2
		)
			return wrongFormat(message);

		let parts = parameters.split('>');
		let verb = utils.cleanString(parts.shift());

		parts = parts.shift().split('=')
		const conjugated = utils.cleanString(parts.shift());
		const conjugation = utils.cleanString(parts.shift());

		const verbObject = references.verbs.find(v => v.text === verb);
		if(!verbObject)
			return message.channel.send(message.response
				.problem('That verb is not included in the references yet.'));

		if(!verbObject.conjugation)
			verbObject.conjugation = {};

		const conjugations = verbObject.conjugation;
		if(
			Object.keys(verbObject.conjugation)
				.some(c => c.match(conjugation)) ||
			Object.values(verbObject.conjugation)
				.some(c => c.match(conjugated))
		)
			return message.channel.send(message.response
				.problem('That conjugation is already added for that verb.'));

		conjugations[conjugation] = conjugated;

		const saved = await saveReferences();
		if(!saved)
			return errorOccurred(message);

		message.channel.send(message.response
			.embed('✅  New Conjugation Added',
				`${verb} -> ${conjugated} (${conjugation})`));
	}

	자료()
	{
		if(this.notTeacher)
			return;

		this.message.channel.send(
			{
				files:
					[{
						attachment: './data/references.json',
						name: 'References.json'
					}]
			});
	}

	갱신자료()
	{
		if(this.notTeacher)
			return;

		const message = this.message;

		const file = message.attachments.first();
		if(!file)
			return message.channel.send(message.response
				.embed('Please upload a new "References.json" file.'));

		if(!file.filename.endsWith('.json'))
			return message.channel.send(message.response
				.embed('Please upload a "json" file.'));

		request.get(file.url, (error, response, content) =>
		{
			if(error || response.statusCode !== 200)
				return errorOccurred(message, error);

			fs.writeFile('references.json', content, error =>
			{
				if(error)
					return errorOccurred(message, error);

				message.channel.send(message.response
					.embed('✅  References updated.'));
			});
		});
	}

	refbackup()
	{
		const message = this.message;

		if(message.author.id !== config.owner)
			return;

		fs.writeFile('./data/references_backup.json',
			JSON.stringify(references, null, '\t'), error =>
			{
				if(error)
					return errorOccurred(message, error);
				message.channel.send(message.response
					.embed('✅  References backed up.'));
			});
	}
}

async function addReference(message, type)
{
	if(this.notTeacher)
		return;

	let parameters = message.parameters;
	if(!parameters || parameters.length === 0 || !parameters.includes('='))
		return wrongFormat(message);

	parameters = parameters.split('=');

	let text = utils.cleanString(parameters.shift());
	let meaning = utils.cleanString(parameters.shift());

	if(text.length === 0 || meaning.length === 0)
		return wrongFormat(message);

	if(type.some(t => t.text.match(text)))
		return message.channel.send(message.response
			.problem("That's already added"));

	// if(!text.includes('to'))
	//     text = `${text}|to ${text}`;
	// else if(text.includes('to'))
	//     text = `${text.replace('to').trim()}|${text}`;

	let entry = { text, meaning };
	type.push(entry);

	const saved = await saveReferences()
	if(!saved)
		return errorOccurred(message);

	message.channel.send(message.response.embed(`✅  New Word Added`,
		`${text.replace(/\|/g, ', ')}: ${meaning.replace(/\|/g, ', ')}`));
}

const saveReferences = _ => save('references', references);
// const saveData = _ => save('data', data);

function save(file, contents)
{
	return new Promise(resolve =>
	{
		fs.writeFile(`./data/${file}.json`,
			JSON.stringify(contents, null, '\t'), error =>
			{
				if(error) 
				{
					console.log(error.message);
					resolve(false);
				}

				resolve(true);
			});
	});
}

function wrongFormat(message)
{
	message.channel.send(message.response.problem('Wrong format.'));
}

function errorOccurred(message, error)
{
	if(error)
		console.error(error);

	message.channel.send(message.response
		.problem('Woops, a problem occurred.'));
}
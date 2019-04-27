const { prefix, owner } = require('../data/config.json');

exports['ping, ㅍ'] = message => message.channel.send(message.response
    .embed(`${~~message.client.ping} ms`));

exports['help, ㄷ'] = message =>
{
    const description = `**Command Prefix: \`${prefix}\`**\n`
        + 'I have **Korean** versions of my **commands**!\n‍';

    const modules =
    [
        {
            title: '🌐 Translation Commands',
            content: 
                '**`translate / ㅂ <text to translate>`** *(번역 - translation)*\n'
                + ' ‍ ‍ ‍ ‍ ‍→ translates the text provided to Korean or English'
                + '(automatic)\n'
                + `‍ ‍ ‍ ‍ ‍ ‍Example: \`${prefix}ㅂ I'm learning Korean.\`\n\n`

                + '**`dictionary / ㅅㅈ <word>`** *(사전 - dictionary)*\n'
                + ' ‍ ‍ ‍ ‍ ‍→ searches the word in a dictionary (Naver).\n'
                + `‍ ‍ ‍ ‍ ‍ ‍Example: \`${prefix}ㅅㅈ music\`\n‍`
        },
        {
            title: '📒 Notebook Commands',
            content:
                '**`note / ㄴ <note>`** *(노트 - note)*\n'
                + '‍ ‍ ‍ ‍ ‍ ‍→ write a note on your notebook.\n'
                + ` ‍ ‍ ‍ ‍ ‍Example: \`${prefix}ㅆ An important link`
                    + ' https://papago.naver.com/?sk=ko&tk=en`\n\n'

                + '**`notebook / ㄱㅊ`** *(공책 - notebook)*\n'
                + '‍ ‍ ‍ ‍ ‍ ‍→ shows your notebook.\n\n'

                + '**`nfind / ㄴㅊ <text to find>`** *(찾다 - to find)*\n'
                + '‍ ‍ ‍ ‍ ‍ ‍→ find text in your notebook.\n'
                + `‍ ‍ ‍ ‍ ‍ ‍Example: \`${prefix}ㄴㅊ hangul\`\n\n`

                + '**`nedit / ㄴㅂ <note number> <new note>`**'
                    + ' *(변하다 - to change)*\n'
                + '‍ ‍ ‍ ‍ ‍ ‍→ edit a note in your notebook by __note number__.\n'
                + ` ‍ ‍ ‍ ‍ ‍Example: \`${prefix}ㄴㅂ 5 new note for note 5\`\n\n`

                + '**`ndelete / ㄴㅅ <note number>`** *(삭제 - deletion)*\n'
                + '‍ ‍ ‍ ‍ ‍ ‍→ delete a note in your notebook by __note number__.\n'
                + `‍ ‍ ‍ ‍ ‍ ‍Example: \`${prefix}ㄴㅅ 1\`\n‍`
        },
        {
            title: '📝 Exercise Commands (has very few content atm)',
            content: 
                '**`kp / ㅋ`** *(keyboard practice/키보드)*\n'
                + ' ‍ ‍ ‍ ‍ ‍→ shows a random Hangul character and asks you to type'
                + ' it as practice to memorize the Korean keyboard (in PC).\n\n'

                + '**`kpw / ㅋㄷ`** *(keyboard practice - word/키보드 단어)*\n'
                + '‍ ‍ ‍ ‍ ‍ ‍→ shows a random word in Hangul and asks you to type it'
                    + ' also as practice to memorize the Korean keyboard'
                    + ' (in PC).\n\n'

                + '**`noun / ㅁㅅ`** *(명사 - noun)*\n'  
                + '‍ ‍ ‍ ‍ ‍ ‍→ shows a noun and asks you to translate it.\n\n'

                + '**`verb / ㄷㅅ`** *(동사 - verb)*\n'
                + '‍ ‍ ‍ ‍ ‍ ‍→ shows a verb and asks you to translate it.\n\n'

                + '**`phrase / ㄱㅈ`** *(구절 - Phrase)*\n'
                + '‍ ‍ ‍ ‍ ‍ ‍→ shows a phrase asks you to translate it.\n‍\n'

                + '**`nnum / ㅎㅅ`** *(한국 수 - Korean Number)*\n'
                + '‍ ‍ ‍ ‍ ‍ ‍→ shows a native korean number and asks you to'
                    + ' translate it.\n\n'

                + '**`snum / ㅈㅅ`** *(중국 수 - Chinese Number)*\n'
                + '‍ ‍ ‍ ‍ ‍ ‍→ shows a sino-korean number and asks you to'
                    + ' translate it.\n\n'

                + '**`conjugate / ㅎㅇ`** *(활용 - Conjugation)*\n'
                + '‍ ‍ ‍ ‍ ‍ ‍→ shows a verb then asks you to conjugate it to a'
                    + ' random conjugation.\n‍\n'
        },
        {
            title: 'ℹ Other Commands',
            content: 
                '**`ping / ㅍ`**\n'
                + '‍ ‍ ‍ ‍ ‍ ‍→ shows the ping of the bot.\n\n'

                + '**`help / ㄷ`** *(돕다 - to help)*\n'
                + '‍ ‍ ‍ ‍ ‍ ‍→ shows this message.'
        }
    ]

    const response = message.response.embed('안녕하세요!')
        .setDescription(description)
        .setThumbnail(message.client.user.displayAvatarURL)
        .setFooter('Ping @esfox#2053 for questions/feedback.');

    modules.forEach(m => response.addField(m.title, m.content));
    message.channel.send(response);
}

const schedule = require('node-schedule');

exports.나연 = message =>
{
    if(message.author.id !== owner)
        return;

    message.channel.send(`Started Timers. ${new Date()}`);

    let date = Date.now();
    date += 10000;

    const task = schedule.scheduleJob(date, _ =>
    {
        message.channel.send(`Task Trigger\n${new Date()}`);
        task.cancel();
    });
}
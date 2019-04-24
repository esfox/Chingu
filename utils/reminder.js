const schedule = require('node-schedule');

let wordReminder;

exports.startWordReminder = callback =>
{
    const date = new Date();
    date.setUTCHours(12);

    const rule = new schedule.RecurrenceRule();
    rule.hour = date.getHours();
    rule.minute = 30;

    wordReminder = schedule.scheduleJob(rule, _ =>
    {
        callback();
    }); 
}

exports.endWordReminder = _ =>
{
    wordReminder.cancel();
}
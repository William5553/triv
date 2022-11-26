const moment = require('moment');
require('moment-duration-format');
const months = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
];

exports.run = (client, message, args) => {
  if (args.length < 2) return message.reply(`${client.getPrefix(message)}${exports.help.usage}`);
  let month = args[0];
  if (validate(month))
    month = parse(month);
  else
    return message.reply(`${month} is not a valid month`);
  const day = args[1];
  if (Number.isNaN(day) || day > 31 || day < 1) return message.reply(`${day} is not a valid day`);
  const now = new Date();
  let year;
  if (args[2])
    year = Number(args[2]);
  else if (now.getMonth() + 1 <= month) {
    year = now.getFullYear();
  } else
    year = now.getFullYear() + 1;
  const future = new Date(year, month - 1, day);
  const time = moment.duration(future - now);
  return message.channel.send(`There ${time.months() ? time.months() === 1 ? "'s" : 'are' : time.days() === 1 ? "'s" : 'are'} ${time.format('M [months and] d [days]')} until ${moment.utc(future).format('dddd, MMMM Do, YYYY')}!`);
};

const validate = value => {
  const num = Number.parseInt(value, 10);
  if (num > 0 && num < 13) return true;
  if (months.includes(value.toLowerCase())) return true;
  return false;
};

const parse = value => {
  const num = Number.parseInt(value, 10);
  if (!Number.isNaN(num)) return num;
  return months.indexOf(value.toLowerCase()) + 1;
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['daysuntil', 'daystil'],
  permLevel: 0,
  cooldown: 2500
};

exports.help = {
  name: 'daysto',
  description: 'Responds with how many days there are until a certain date',
  usage: 'daysto [month] [day] [year]',
  example: 'daysto october 31 2024'
};

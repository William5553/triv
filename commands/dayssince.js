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
  const year = args[2] ? Number(args[2]) : now.getFullYear();
  if (Number.isNaN(year)) return message.reply(`${year} is not a valid year`);
  const past = new Date(year, month - 1, day);
  if (year < 100) past.setFullYear(year);
  return message.channel.send(`It's been ${moment.duration(now - past).format('Y [years,] M [months and] d [days]')} since ${moment.utc(past).format('dddd, MMMM Do, YYYY')}!`);
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
  aliases: [],
  permLevel: 0,
  cooldown: 2500
};

exports.help = {
  name: 'dayssince',
  description: 'Responds with how many days there have been since a certain date',
  usage: 'dayssince [month] [day] [year]',
  example: 'dayssince October 10 2015'
};

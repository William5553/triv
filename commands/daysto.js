const moment = require('moment');
require('moment-duration-format');

exports.run = (client, message, args) => {
if (args.length < 2) return message.reply(`${prefix}${exports.help.usage}`);
const month = args[0];
if (!validate(month)) return message.reply(`${month} is not a valid month`);
else month = parse(month);
const day = args[1];
if (isNan(day) || day > 31 || day < 1) return message.reply(`${day} is not a valid day`);
const now = new Date();
		let year = now.getMonth() + 1 <= month ? now.getFullYear() : now.getFullYear() + 1;
		if (month === now.getMonth() + 1 && now.getDate() >= day) ++year;
		const future = new Date(year, month - 1, day);
		const futureFormat = moment.utc(future).format('dddd, MMMM Do, YYYY');
		const time = moment.duration(future - now);
		const link = time.months() ? time.months() === 1 ? 'is' : 'are' : time.days() === 1 ? 'is' : 'are';
		return msg.say(`There ${link} ${time.format('M [months and] d [days]')} until ${futureFormat}!`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['daysuntil'],
  permLevel: 0
};

exports.help = {
  name: 'daysto',
  description: "Responds with how many days there are until a certain date",
  usage: 'daysto [month] [day]'
};

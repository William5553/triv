const moment = require('moment');
require('moment-duration-format');

const months = [
	"january",
	"february",
	"march",
	"april",
	"may",
	"june",
	"july",
	"august",
	"september",
	"october",
	"november",
	"december"
];

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
		return message.channel.send(`There ${link} ${time.format('M [months and] d [days]')} until ${futureFormat}!`);
};

function validate(value) {
		const num = Number.parseInt(value, 10);
		if (num > 0 && num < 13) return true;
		if (months.includes(value.toLowerCase())) return true;
		return false;
	}

	function parse(value) {
		const num = Number.parseInt(value, 10);
		if (!Number.isNaN(num)) return num;
		return months.indexOf(value.toLowerCase()) + 1;
	}

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

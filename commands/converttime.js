const ms = require('ms');
const settings = require('../settings.json');
exports.run = (client, message, args) => {
	const toConvert = args[0];
	const convertTo = args[1];
	
	if (args.length < 1) return message.reply(`Usage: ${settings.prefix}converttime [time] [unit]`);
	
	let finalTime;
	let unit = getUnit(convertTo);
	if (!unit && toConvert) return message.reply(`what should I convert ${toConvert} into? specify a unit.`);
	
	const timeInMs = ms(toConvert);
	if (isNan(timeInMs)) return message.reply('the time you tried to convert is invalid');
	const timeInS = timeInMs / 1000;
	const timeInM = timeInS / 60;
	const timeInH = timeInM / 60;
	const timeInD = timeInH / 24;
	const timeInW = timeInD / 7;
	const timeInMn = timeInD / 30;
	const timeInY = timeInD / 365;
	const timeInDe = timeInY / 10;
	
	switch (unit) {
		case 'milliseconds':
			finalTime = timeInMs;
		case 'seconds':
			finalTime = timeInS;
		case 'minutes':
			finalTime = timeInM;
		case 'hours':
			finalTime = timeInH;
		case 'days':
			finalTime = timeInD;
		case 'weeks':
			finalTime = timeInW;
		case 'months':
			finalTime = timeInMn;
		case 'years':
			finalTime = timeInY;
		case 'decades':
			finalTime = timeInDe;
		default:
			return client.logger.error(`${unit} was not found in the switch statement`);
	}
	
	message.channel.send(`${toConvert} is equal to ${finalTime} ${unit}`);
};

async function getUnit(convertTo) {
	if (!convertTo) return;
	let unit;
	const msArray = ['ms', 'milli', 'millisecond', 'milliseconds']
	const sArray = ['s', 'second', 'seconds']
	const mArray = ['m', 'minute', 'minutes']
	const hArray = ['h', 'hr', 'hrs', 'hour', 'hours']
	const dArray = ['d', 'day', 'days']
	const wArray = ['w', 'wk', 'week', 'weeks']
	const mnArray = ['mo', 'mn', 'mnth', 'month', 'months']
	const yArray = ['y', 'yr', 'year', 'years']
	const deArray = ['de', 'dec', 'decade', 'decades']
	
	if (msArray.includes(convertTo)
		unit = 'milliseconds';
	if (sArray.includes(convertTo)
		unit = 'seconds';
	if (mArray.includes(convertTo)
		unit = 'minutes';
	if (hArray.includes(convertTo)
		unit = 'hours';
	if (dArray.includes(convertTo)
		unit = 'days';
	if (wArray.includes(convertTo)
		unit = 'weeks';
	if (mnArray.includes(convertTo)
		unit = 'months';
	if (yArray.includes(convertTo)
		unit = 'years';
	if (deArray.includes(convertTo)
		unit = 'decades';
	return unit;
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['ct'],
  permLevel: 0
};

exports.help = {
  name: 'converttime',
  description: 'Converts time units',
  usage: 'converttime [time] [unit]',
  example: 'converttime 1d h'
};

const { formatNumber } = require('../util/Util');
exports.run = (client, message, args) => message.channel.send(formatNumber(args.join(' ')));

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['fnum', 'fnumber', 'formatnum', 'formatn'],
  permLevel: 0
};

exports.help = {
  name: 'formatnumber',
  description: 'Adds commas to a number',
  usage: 'formatnumber [number]',
  example: 'formatnumber 4392674'
};

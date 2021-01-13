const esrever = require('esrever'),
  replaceD = require('../assets/upsidedown.json');

exports.run = (client, message, args) => message.channel.send(esrever.reverse(args.join(' ').replace(/[a-z0-9&_.,!"?']/gi, match => {
  return typeof replaceD[match] != 'undefined' ? replaceD[match] : match;
})));

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['fliptext', 'upsidedownify'],
  permLevel: 0
};

exports.help = {
  name: 'upsidedown',
  description: 'Flips text upside down',
  usage: 'upsidedown [text]'
};

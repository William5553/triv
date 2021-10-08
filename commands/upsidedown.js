const esrever = require('esrever');
const replaceD = require('../assets/upsidedown.json');

exports.run = (client, message, args) => message.channel.send(esrever.reverse(args.join(' ').replace(/[\w!"&',.?]/gi, match => {
  return typeof replaceD[match] != 'undefined' ? replaceD[match] : match;
})));

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['fliptext', 'upsidedownify'],
  permLevel: 0,
  cooldown: 2500
};

exports.help = {
  name: 'upsidedown',
  description: 'Flips text upside down',
  usage: 'upsidedown [text]',
  example: 'upsidedown Triv is a good bot'
};

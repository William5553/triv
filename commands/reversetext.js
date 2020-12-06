const esrever = require('esrever');
exports.run = (client, message, args) => {
  message.channel.send(esrever.reverse(args.join()));
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['reverse'],
  permLevel: 0
};

exports.help = {
  name: 'reversetext',
  description: 'Reverses text',
  usage: 'reversetext [text]'
};
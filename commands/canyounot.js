exports.run = async (client, message) => message.channel.send('Can YOU not?');

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'canyounot',
  description: 'Can YOU not?',
  usage: 'canyounot',
  example: 'canyounot'
};
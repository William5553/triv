exports.run = async (client, message) => message.channel.send(`Today **is${new Date().getDay() === 2 ? '' : ' not'}** Tuesday.`);

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['tuesday', 'tues', 'isittues'],
  permLevel: 0,
  cooldown: 1000
};

exports.help = {
  name: 'isittuesday',
  description: 'Determines if today is Tuesday',
  usage: 'isittuesday',
  example: 'isittuesday'
};

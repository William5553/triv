exports.run = async (client, message) => message.channel.send(`Today **is${new Date().getDay() === 1 ? '' : ' not'}** Tuesday. It is ${new Date().getDay()}`);

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['tuesday', 'tues', 'isittues'],
  permLevel: 0
};

exports.help = {
  name: 'isittuesday',
  description: 'Determines if today is Tuesday',
  usage: 'isittuesday',
  example: 'isittuesday'
};

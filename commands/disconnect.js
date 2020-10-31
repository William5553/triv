exports.run = (client, message) => {
const settings = require('../settings.json');
  if (message.author.id !== settings.ownerid) return message.reply('no');
  message.channel.send('Goodbye! 💀');
  client.destroy();
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 4
};

exports.help = {
  name: 'disconnect',
  description: 'Kills the bot',
  usage: 'disconnect'
};

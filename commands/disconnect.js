exports.run = async (client, message) => {
  const settings = require('../settings.json');
  if (message.author.id !== settings.ownerid) return message.reply('no');
  await message.channel.send('Goodbye! 💀');
  client.destroy();
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['die'],
  permLevel: 4,
};

exports.help = {
  name: 'disconnect',
  description: 'Kills the bot',
  usage: 'disconnect',
};

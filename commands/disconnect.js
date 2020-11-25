exports.run = async (client, message) => {
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

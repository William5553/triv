exports.run = (client, message) => {

  if (message.author.id !== '186620503123951617') return message.reply('No.......');
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

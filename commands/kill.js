exports.run = (client, message) => {
  const fs = require('fs');
  const settings = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));
  if (message.author.id !== settings.ownerid) return message.reply('No.......');
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

exports.run = (client, message) => {
  console.clear();
  message.delete();
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['cc', 'cls'],
  permLevel: 10
};
  
exports.help = {
  name: 'clearconsole',
  description: 'Clears the console',
  usage: 'clearconsole',
  example: 'clearconsole'
};
  
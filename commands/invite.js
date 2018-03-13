const settings = require('../settings.json');
exports.run = (client, message) => {
  message.channel.send('My invite link is: https://discordapp.com/oauth2/authorize?permissions=2146958591&scope=bot&client_id=' + settings.bot_client_id);
};


exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['inv'],
  permLevel: 0
};

exports.help = {
  name: 'invite',
  description: 'Gives you an invite link for me.',
  usage: 'invite'
};

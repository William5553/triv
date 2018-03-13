exports.run = (client, message) => {
  message.reply('Your IP address is 127.0.1. https://whatismyipaddress.com/ https://whatismyip.com');
};


exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'ip',
  description: 'Gets your IP address.',
  usage: 'ip'
};

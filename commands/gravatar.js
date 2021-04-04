const md5 = require('md5');

exports.run = async (client, message, args) => {
  const hash = md5(args.join(' ').replace(' ', '').toLowerCase());
  message.channel.send(`https://www.gravatar.com/avatar/${hash}`);
};
  
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};
  
exports.help = {
  name: 'gravatar',
  description: 'Gets a gravatar avatar from an email',
  usage: 'gravatar [email]'
};
  
exports.run = (client, message, args) => {
  const settings = require('../settings.json');
  message.delete();
  const msg = args.slice(0).join(' ');
  if (msg.length < 1) return message.reply('tell me what to say dummy');
  message.channel.send(msg);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['say'],
  permLevel: 4
};

exports.help = {
  name: 'send',
  description: 'Sends a message.',
  usage: 'send [message]'
};

exports.run = (client, message, args) => {
  const msg = args.join(' ');
  if (msg.length < 1) return message.reply('tell me what to say dummy');
  message.delete();
  message.channel.send(msg);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['send'],
  permLevel: 3,
  cooldown: 300
};

exports.help = {
  name: 'say',
  description: 'Sends a message.',
  usage: 'say [message]'
};

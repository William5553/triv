exports.run = (client, message, args) => {
  const settings = require('../settings.json');
  if (message.author.id !== settings.ownerid) return message.reply('you can\'t do that!');
  message.delete();
  let Botmessage = args.slice(0).join(' ');
  if(Botmessage.length < 1) return message.reply('What do I say!?');
  message.channel.send(Botmessage);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 4
};

exports.help = {
  name: 'send',
  description: 'Sends a message.',
  usage: 'send [message]'
};

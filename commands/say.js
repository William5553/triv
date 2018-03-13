exports.run = (client, message, args) => {
  if (message.author.id !== '186620503123951617') return message.reply('You are not my master!');
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

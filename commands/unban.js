//omg no stop eslint

exports.run = (client, message, args) => {
  let reason = args.slice(1).join(' ');
  client.unbanReason = reason;
  client.unbanAuth = message.author;
  let user = args[0];
  let modlog = client.channels.find('name', 'bot-logs');
  if (!modlog) return message.reply('I cannot find a bot-logs channel');
  if (!user) return message.reply('You must supply a User Resolvable, aka a user ID.').catch(console.error);
  if (reason.length < 1) return message.reply('You must supply a reason for the unban.');
  message.guild.unban(user);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: 'unban',
  description: 'Unbans the user.',
  usage: 'unban [mention] [reason]'
};

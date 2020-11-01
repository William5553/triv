exports.run = (client, message, args) => {
  let reason = args.slice(1).join(' ');
  client.unbanReason = reason;
  client.unbanAuth = message.author;
  const user = args[0];
  const botlog = message.guild.channels.cache.find(
    channel => channel.name === 'bot-logs'
  );
  if (message.guild.me.hasPermission('MANAGE_CHANNELS') && !botlog) {
    message.guild.channels.create('bot-logs', { type: 'text' });
  } else if (!botlog)
    return message.reply('I cannot find a bot-logs channel');
  const usah = client.users.fetch(args[0]);
  if (!user || !usah) return message.reply('You must supply a user ID.').catch(console.error);
  if (reason.length < 1) return message.reply('You must supply a reason for the unban.');
  message.guild.members.unban(user, {reason: reason}).catch(message.channel.send);
  message.channel.send(`unbanned ${usah.tag}`);
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

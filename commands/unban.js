const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  const reason = args.slice(1).join(' '),
    user = args[0],
    botlog = message.guild.channels.cache.find(channel => channel.name === 'bot-logs');
  if (message.guild.me.hasPermission('MANAGE_CHANNELS') && !botlog)
    message.guild.channels.create('bot-logs', { type: 'text' });
  else if (!botlog)
    return message.reply('I cannot find a bot-logs channel');
  if (!user || isNaN(user)) return message.reply('you must supply a user ID.').catch(client.logger.error);
  if (reason.length < 1) return message.reply('you must supply a reason for the unban');
  let banned;
  try {
    banned = await message.guild.fetchBan(user);
  } catch {
    return message.reply('they are not banned');
  }
  if (!banned.user) return message.reply('that user is not banned');
  message.guild.members.unban(user, { reason: reason }).catch(message.channel.send);
  message.channel.send(`Unbanned ${banned.user}${banned.reason ? ` who was previously banned for ${banned.reason}` : ''}`);
  return botlog.send(new MessageEmbed()
    .setColor(0x00ae86)
    .setTimestamp()
    .setDescription(
      `**Action:** Unban\n**Target:** ${banned.user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`
    )
    .setFooter(`User ID: ${banned.user.id}`)
  );
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: 'unban',
  description: 'Unbans the provided user',
  usage: 'unban [user id] [reason]'
};

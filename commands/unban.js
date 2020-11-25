const { MessageEmbed } = require('discord.js');
exports.run = (client, message, args) => {
  const reason = args.slice(1).join(' ');
  const user = args[0];
  const botlog = message.guild.channels.cache.find(channel => channel.name === 'bot-logs');
  if (message.guild.me.hasPermission('MANAGE_CHANNELS') && !botlog) {
    message.guild.channels.create('bot-logs', { type: 'text' });
  } else if (!botlog) return message.reply('I cannot find a bot-logs channel');

  if (!user) return message.reply('you must supply a user ID.').catch(client.logger.error);
  if (reason.length < 1) return message.reply('you must supply a reason for the unban');
  message.guild.members.unban(user, { reason: reason }).catch(message.channel.send);
  const embed = new MessageEmbed()
    .setColor(0x00ae86)
    .setTimestamp()
    .setDescription(
      `**Action:** Unban\n**Target:** ${user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`
    );
  message.channel.send('unbanned');
  return message.guild.channels.cache.find(channel => channel.name === 'bot-logs').send({ embed });
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

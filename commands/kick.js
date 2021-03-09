const { MessageEmbed } = require('discord.js');
const { parseUser, caseNumber } = require('../util/Util');

exports.run = async (client, message, args) => {
  const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLowerCase());
  if (!member) return message.reply('tag someone to kick next time before I kick you');
  if (parseUser(message, member) !== true) return;
  const botlog = message.guild.channels.cache.find(channel => channel.name === 'bot-logs');
  if (message.guild.me.hasPermission('MANAGE_CHANNELS') && !botlog)
    message.guild.channels.create('bot-logs', { type: 'text' });
  else if (!botlog) return message.channel.send('I cannot find a channel named bot-logs');
  await member.user.send(`you've been kicked from ${message.guild.name} by ${message.author}`).catch(client.logger.error);
  member.kick().catch(client.logger.error);
  message.channel.send(`Kicked ${member.user}`);
  const caseNum = await caseNumber(client, botlog);
  const reason =
    args.splice(1).join(' ') ||
    `Awaiting moderator's input. Use ${process.env.prefix}reason ${caseNum} <reason>.`;
  return botlog.send(new MessageEmbed()
    .setColor(0x00ae86)
    .setTimestamp()
    .setDescription(
      `**Action:** Kick\n**Target:** ${member.user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}\n**User ID:** ${member.user.id}`
    )
    .setFooter(`ID ${caseNum}`)
  ).catch(client.logger.error);
};

exports.conf = {
  enabled: true,
  aliases: [],
  guildOnly: true,
  permLevel: 2
};

exports.help = {
  name: 'kick',
  description: 'Kicks the mentioned user.',
  usage: 'kick [mention] [reason]'
};

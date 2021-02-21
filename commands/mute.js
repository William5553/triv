const { MessageEmbed } = require('discord.js'),
  { caseNumber } = require('../util/caseNumber.js'),
  { parseUser } = require('../util/parseUser.js');
exports.run = async (client, message, args) => {
  const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLowerCase());
  if (!member) return message.reply('you must mention someone to mute them').catch(client.logger.error);
  if (parseUser(message, member) !== true) return;
  const botlog = message.guild.channels.cache.find(channel => channel.name === 'bot-logs');
  const caseNum = await caseNumber(client, botlog);
  let muteRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
  if (message.guild.me.hasPermission('MANAGE_CHANNELS') && !botlog)
    message.guild.channels.create('bot-logs', { type: 'text' });
  else if (!botlog) return message.reply('I cannot find a bot-logs channel').catch(client.logger.error);
  if (!message.guild.me.hasPermission('MANAGE_ROLES'))
    return message.reply('I do not have the **MANAGE_ROLES** permission').catch(client.logger.error);
  if (!muteRole) {
    muteRole = message.guild.roles
      .create({
        data: {
          name: 'muted',
          color: [255, 0, 0],
          position: 1
        }
      })
      .catch(client.logger.error);
  }
  const reason =
    args.splice(1).join(' ') ||
    `Awaiting moderator's input. Use ${client.settings.prefix}reason ${caseNum} <reason>.`;

  message.guild.channels.cache.forEach(f => {
    f.updateOverwrite(muteRole, {
      SEND_MESSAGES: false
    });
  });
  if (member.roles.cache.has(muteRole.id)) {
    member.roles
      .remove(muteRole.id, reason)
      .then(() => {
        message.channel.send(`Unmuted ${member.user}`);
        botlog.send(new MessageEmbed()
          .setColor(0x00ae86)
          .setTimestamp()
          .setDescription(
            `**Action:** Unmute\n**Target:** ${member.user.tag}\n**Moderator:** ${message.author.tag}\n**User ID:** ${member.user.tag}`
          )
          .setFooter(`ID ${caseNum}`)).catch(client.logger.error);
      })
      .catch(message.channel.send);
  } else {
    member.roles
      .add(muteRole.id, reason)
      .then(() => {
        message.channel.send(`Muted ${member.user}`);
        botlog.send(new MessageEmbed()
          .setColor(0x00ae86)
          .setTimestamp()
          .setDescription(
            `**Action:** Mute\n**Target:** ${member.user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}\n**User ID:** ${member.user.tag}`
          )
          .setFooter(`ID ${caseNum}`)).catch(client.logger.error);
      })
      .catch(message.channel.send);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['unmute'],
  permLevel: 2
};

exports.help = {
  name: 'mute',
  description: 'Toggles the mute of a member',
  usage: 'mute [user] [reason] OR unmute [user]'
};

const { MessageEmbed } = require('discord.js'),
  { caseNumber } = require('../util/caseNumber.js'),
  { parseUser } = require('../util/parseUser.js');
exports.run = async (client, message, args) => {
  const userr = message.mentions.members.first() || message.guild.members.fetch(args[0]) || null;
  if (!userr) return message.reply('you must mention someone to mute them').catch(client.logger.error);
  parseUser(message, userr);
  if (userr.user.id === client.settings.owner_id) {
    return message.reply('absolutely not.');
  }
  if (userr.user.id === client.user.id) {
    return message.reply("bruh");
  }
  const botlog = message.guild.channels.cache.find(channel => channel.name === 'bot-logs');
  const caseNum = await caseNumber(client, botlog);
  let muteRole =
    message.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
  if (message.guild.me.hasPermission('MANAGE_CHANNELS') && !botlog) {
    message.guild.channels.create('bot-logs', { type: 'text' });
  } else if (!botlog) return message.reply('I cannot find a bot-logs channel').catch(client.logger.error);
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
    args.splice(1, -1).join(' ') ||
    `Awaiting moderator's input. Use ${client.settings.prefix}reason ${caseNum} <reason>.`;

  message.guild.channels.cache.forEach(f => {
    f.updateOverwrite(muteRole, {
      SEND_MESSAGES: false
    });
  });
  if (userr.roles.cache.has(muteRole.id)) {
    userr.roles
      .remove(muteRole.id, reason)
      .then(() => {
        botlog.send(new MessageEmbed()
          .setColor(0x00ae86)
          .setTimestamp()
          .setDescription(
            `**Action:** Unmute\n**Target:** ${userr.user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}\n**User ID:** ${userr.user.tag}`
          )
          .setFooter(`ID ${caseNum}`)).catch(client.logger.error);
      })
      .catch(message.channel.send);
  } else {
    userr.roles
      .add(muteRole.id, reason)
      .then(() => {
        botlog.send(new MessageEmbed()
          .setColor(0x00ae86)
          .setTimestamp()
          .setDescription(
            `**Action:** Mute\n**Target:** ${userr.user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}\n**User ID:** ${userr.user.tag}`
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
  usage: 'mute [user] OR unmute [user]'
};

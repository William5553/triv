const {MessageEmbed} = require('discord.js');
const {caseNumber} = require('../util/caseNumber.js');
const {parseUser} = require('../util/parseUser.js');
const settings = require('../settings.json');
exports.run = async (client, message, args) => {
  const userr = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if (!userr) return message.reply('You must mention someone to mute them.').catch(client.logger.error);
  parseUser(message, userr.user);
  if (userr.user.id === settings.ownerid) {
    return message.reply('absolutely not.');
  }
  if (userr.user.id === client.user.id) {
    return message.channel.send('Don\'t mute me!');
  }
  const botlog = message.guild.channels.cache.find(
      channel => channel.name === 'bot-logs'
    );
  const caseNum = await caseNumber(client, botlog);
  const muteRole = message.guild.roles.cache.find(r => r.name === 'Muted') || message.guild.roles.cache.find(r => r.name === 'muted');
  if (message.guild.me.hasPermission('MANAGE_CHANNELS') && !botlog) {
    message.guild.channels.create('bot-logs', { type: 'text' });
  } else if (!botlog) 
  return message.reply('I cannot find a bot-logs channel').catch(client.logger.error);
  if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.reply('I do not have the **MANAGE_ROLES** permission').catch(client.logger.error);
  if (!muteRole) {
    muteRole = message.guild.roles.create({
  data: {
    name: 'Muted',
    color: 'RED',
    permissions: '{ SEND_MESSAGES: false }'
  }
}).catch(client.logger.error);
  }
  const reason = args.splice(1, args.length).join(' ') || `Awaiting moderator's input. Use ${settings.prefix}reason ${caseNum} <reason>.`;

  const embed = new MessageEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .setDescription(`**Action:** Un/mute\n**Target:** ${userr.user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}\n**User ID:** ${userr.user.tag}`)
    .setFooter(`ID ${caseNum}`);

message.channel.updateOverwrite(muteRole, { SEND_MESSAGES: false })
  if (userr.roles.cache.has(muteRole.id)) {
    userr.roles.remove(muteRole.id, reason).then(() => {
      botlog.send({embed}).catch(client.logger.error);
    }).catch(message.channel.send);
  } else {
    userr.roles.add(muteRole.id, reason).then(() => {
      botlog.send({embed}).catch(client.logger.error);
    }).catch(message.channel.send);
  }

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['unmute'],
  permLevel: 2
};

exports.help = {
  name: 'mute',
  description: `Toggles the mute of a member. (Use ${settings.prefix}mute or ${settings.prefix}unmute)`,
  usage: 'mute [user] OR unmute [user]'
};

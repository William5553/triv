const {MessageEmbed} = require('discord.js');
const {caseNumber} = require('../util/caseNumber.js');
const {parseUser} = require('../util/parseUser.js');
const settings = require('../settings.json');
exports.run = async (client, message, args) => {
  const user = message.mentions.users.first();
  parseUser(message, user);
  if (user.id == settings.ownerid) {
    return message.channel.send('Don\'t mute willeh!');
  }
  if (user.id == settings.bot_client_id) {
    return message.channel.send('Don\'t mute me!');
  }
  const botlog = message.guild.channels.find(
      channel => channel.name === 'bot-logs'
    );
  const caseNum = await caseNumber(client, botlog);
  const muteRole = client.guilds.get(message.guild.id).roles.find('name', 'muted');
  if (!botlog) return message.reply('I cannot find a bot-logs channel').catch(console.error);
  if (!muteRole) return message.reply('I cannot find a mute role').catch(console.error);
  if (message.mentions.users.size < 1) return message.reply('You must mention someone to mute them.').catch(console.error);
  const reason = args.splice(1, args.length).join(' ') || `Awaiting moderator's input. Use ${settings.prefix}reason ${caseNum} <reason>.`;

  const embed = new MessageEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .setDescription(`**Action:** Un/mute\n**Target:** ${user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}\n**User ID:** ${user.tag}`)
    .setFooter(`ID ${caseNum}`);

  if (!message.guild.member(client.user).hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) return message.reply('I do not have the correct permissions.').catch(console.error);

  if (message.guild.member(user).roles.has(muteRole.id)) {
    message.guild.member(user).removeRole(muteRole).then(() => {
      client.channels.get(botlog.id).send({embed}).catch(console.error);
    });
  } else {
    message.guild.member(user).addRole(muteRole).then(() => {
      client.channels.get(botlog.id).send({embed}).catch(console.error);
    });
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

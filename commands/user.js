const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const flags = {
  DISCORD_EMPLOYEE: 'Discord Employee',
  PARTNERED_SERVER_OWNER: 'Discord Partner',
  BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
  BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
  HYPESQUAD_EVENTS: 'HypeSquad Events',
  HOUSE_BRAVERY: 'House of Bravery',
  HOUSE_BRILLIANCE: 'House of Brilliance',
  HOUSE_BALANCE: 'House of Balance',
  EARLY_SUPPORTER: 'Early Supporter',
  TEAM_USER: 'Team User',
  SYSTEM: 'System',
  VERIFIED_BOT: 'Verified Bot',
  EARLY_VERIFIED_BOT_DEVELOPER: 'Early Verified Bot Developer',
  DISCORD_CERTIFIED_MODERATOR: 'Discord Certified Moderator'
};

exports.run = async (client, message, args) => {
  const member = message.mentions.members.first() || message.guild.members.cache.get(args.join(' ')) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLowerCase()) || message.member;
  const { user } = member;
  const userFlags = user.flags ? user.flags.toArray() : [];
  const embed = new MessageEmbed()
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .setAuthor(user.tag)
    .addField('❯ Discord Join Date', moment.utc(user.createdAt).format('MM/DD/YYYY h:mm A'), true)
    .addField('❯ ID', user.id, true)
    .addField('❯ Bot', user.bot ? 'Yes' : 'No', true)
    .addField('❯ Flags', userFlags.length > 0 ? userFlags.map(flag => flags[flag]).join(', ') : 'None');
  if (message.guild) {
    try {
      const member = await message.guild.members.fetch(user.id);
      const defaultRole = message.guild.roles.cache.get(message.guild.id);
      const roles = member.roles.cache
        .filter(role => role.id !== defaultRole.id)
        .sort((a, b) => b.position - a.position)
        .map(role => role.name);
      embed
        .addField('❯ Server Join Date', moment.utc(member.joinedAt).format('MM/DD/YYYY h:mm A'), true)
        .addField('❯ Highest Role', member.roles.highest.id === defaultRole.id ? 'None' : member.roles.highest.name, true)
        .addField('❯ Hoist Role', member.roles.hoist ? member.roles.hoist.name : 'None', true)
        .addField(`❯ Roles (${roles.length})`, roles.length > 0 ? trimArray(roles, 6).join(', ') : 'None')
        .setColor(member.displayHexColor);
    } catch {
      embed.setFooter('Failed to resolve member, showing basic user information instead.');
    }
  }
  return message.channel.send({ embeds: [embed] });
};

const trimArray = (arr, maxLen) => {
  if (arr.length > maxLen) {
    const len = arr.length - maxLen;
    arr = arr.slice(0, maxLen);
    arr.push(`${len} more...`);
  }
  return arr;
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['userinfo', 'member', 'memberinfo', 'profile', 'whois', 'who'],
  permLevel: 0,
  cooldown: 1000
};

exports.help = {
  name: 'user',
  description: 'Responds with detailed information on a user',
  usage: 'user [user]'
};

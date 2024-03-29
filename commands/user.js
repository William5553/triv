const { MessageEmbed } = require('discord.js');
const flags = {
  DISCORD_EMPLOYEE: 'Discord Employee',
  PARTNERED_SERVER_OWNER: 'Partnered Server Owner',
  BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
  BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
  HYPESQUAD_EVENTS: 'HypeSquad Events Coordinator',
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
    .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
    .addFields([
      { name: '❯ Username', value: user.username, inline: true },
      { name: '❯ Discriminator', value: `#${user.discriminator}`, inline: true },
      { name: '❯ Nickname', value: member.nickname ?? 'None', inline: true },
      { name: '❯ Account Creation Date', value: `<t:${Math.round(user.createdAt.getTime()/1000)}:F>`, inline: true },
      { name: '❯ ID', value: user.id, inline: true },
      { name: '❯ Bot', value: user.bot ? 'Yes' : 'No', inline: true },
      { name: '❯ Flags', value: userFlags.length > 0 ? userFlags.map(flag => flags[flag]).join(', ') : 'None', inline: true }
    ]);
  if (message.guild) {
    try {
      const member = await message.guild.members.fetch(user.id);
      const defaultRole = message.guild.roles.cache.get(message.guild.id);
      const roles = member.roles.cache
        .filter(role => role.id !== defaultRole.id)
        .sort((a, b) => b.position - a.position)
        .map(role => role.name);
      embed
        .addFields([
          { name: '❯ Server Join Date', value: `<t:${Math.round(member.joinedAt.getTime()/1000)}:F>`, inline: true },
          { name: '❯ Highest Role', value: member.roles.highest.id === defaultRole.id ? 'None' : member.roles.highest.name, inline: true },
          { name: '❯ Hoist Role', value: member.roles.hoist ? member.roles.hoist.name : 'None', inline: true },
          { name: `❯ Roles (${roles.length})`, value: roles.length > 0 ? trimArray(roles, 6).join(', ') : 'None' }
        ])
        .setColor(member.displayHexColor);
    } catch {
      embed.setFooter({ text: 'Failed to resolve member, showing basic user information instead.' });
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

const { Permissions } = require('discord.js');

module.exports = (member) => {
  if (member.client.settings.get(member.guild.id).joinRoleID && member.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES))
    member.roles.add(member.client.settings.get(member.guild.id).joinRoleID, 'Default join role');
};

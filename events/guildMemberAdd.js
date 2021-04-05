module.exports = (member) => {
  if (member.client.settings.get(member.guild.id).joinRoleID)
    member.roles.add(member.client.settings.get(member.guild.id).joinRoleID, 'Default join role');
};
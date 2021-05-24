module.exports = (client, channel) => {
  if (!channel.guild) return;
  const { guild } = channel;
  if (client.guildData.get(guild.id).verificationSetUp == true && channel.name != 'verify' && client.settings.get(guild.id).verifiedRoleID) {
    if (!channel.permissionsFor(guild.roles.everyone).has('SEND_MESSAGES'))
      channel.updateOverwrite(guild.roles.resolve(client.settings.get(guild.id).verifiedRoleID), { SEND_MESSAGES: true });
    if (!channel.permissionsFor(guild.roles.everyone).has('VIEW_CHANNEL'))
      channel.updateOverwrite(guild.roles.resolve(client.settings.get(guild.id).verifiedRoleID), { VIEW_CHANNEL: true });
    channel.updateOverwrite(guild.roles.everyone, { SEND_MESSAGES: false, VIEW_CHANNEL: false });
  }
  if (client.settings.get(guild.id).muteRoleID)
    channel.updateOverwrite(guild.roles.resolve(client.settings.get(guild.id).muteRoleID), { SEND_MESSAGES: false });
};
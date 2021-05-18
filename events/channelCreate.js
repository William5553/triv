module.exports = (client, channel) => {
  const { guild } = channel;
  if (client.guildData.get(guild.id).verificationSetUp == true && channel.name != 'verify' && client.settings.get(guild.id).verifiedRoleID) {
    channel.updateOverwrite(guild.roles.everyone, { SEND_MESSAGES: false, VIEW_CHANNEL: false });
    channel.updateOverwrite(guild.roles.resolve(client.settings.get(guild.id).verifiedRoleID), { SEND_MESSAGES: true, VIEW_CHANNEL: true });
  }
  if (client.settings.get(guild.id).muteRoleID)
    channel.updateOverwrite(guild.roles.resolve(client.settings.get(guild.id).muteRoleID), { SEND_MESSAGES: false });
};
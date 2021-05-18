module.exports = (client, guild) => {
  client.infractions.delete(guild.id);
  client.settings.delete(guild.id);
  client.guildData.delete(guild.id);
};

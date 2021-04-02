module.exports = (client, guild) => {
  client.warnings.delete(guild.id);
  client.settings.delete(guild.id);
};

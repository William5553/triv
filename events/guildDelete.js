module.exports = (client, guild) => {
  client.infractions.delete(guild.id);
  client.settings.delete(guild.id);
};

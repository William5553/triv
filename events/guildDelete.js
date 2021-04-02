module.exports = (client, guild) => {
  client.warnings.delete(guild.id);
};

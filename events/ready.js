module.exports = client => {
  client.logger.log(client.user.tag, 'ready');
  if (client.guilds.cache.size === 1)
    client.user.setActivity(`${client.settings.prefix}help | ${client.guilds.cache.size} guild`, { type: 'LISTENING' });
  else
    client.user.setActivity(`${client.settings.prefix}help | ${client.guilds.cache.size} guilds`, { type: 'LISTENING' });
};

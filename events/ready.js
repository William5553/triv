module.exports = client => {
  client.logger.log(`User: ${client.user.tag} Prefix: ${client.settings.prefix} Serving ${client.users.cache.size} users in ${client.guilds.cache.size} server${client.guilds.cache.size === 1 ? '' : 's'}`, 'ready');
  client.user.setActivity(`${client.settings.prefix}help | ${client.guilds.cache.size} guild${client.guilds.cache.size === 1 ? '' : 's'}`, { type: 'LISTENING' });
  setInterval(() => client.user.setActivity(`${client.settings.prefix}help | ${client.guilds.cache.size} guild${client.guilds.cache.size === 1 ? '' : 's'}`, { type: 'LISTENING' }), 60000);
};

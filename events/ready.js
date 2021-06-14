const { version } = require('discord.js');

module.exports = async client => {
  client.logger.log(`User: ${client.user.tag} | Prefix: ${process.env.prefix} | ${client.commands.array().length} commands | Serving ${client.users.cache.size} users in ${client.guilds.cache.size} server${client.guilds.cache.size === 1 ? '' : 's'} running discord.js ${version}`, 'ready');
  client.user.setActivity(`${process.env.prefix}help | ${client.commands.size} cmd${client.commands.array().length === 1 ? '' : 's'}`, { type: 'LISTENING' });

  client.application = await client.application?.fetch();
  if (client.owners.length < 1) client.application.team ? client.owners.push(...client.application.team.members.keys()) : client.owners.push(client.application.owner.id);
  setInterval(async () => {
    client.owners = [];
    client.application = await client.application.fetch();
    client.application.team ? client.owners.push(...client.application.team.members.keys()) : client.owners.push(client.application.owner.id);
  }, 60000);
};

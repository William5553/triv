module.exports = async (client, guild) => {
  if (client.blacklist.guild.includes(guild.id) || client.blacklist.user.includes(guild.ownerID)) {
    try {
      if (guild.systemChannel && guild.systemChannel.permissionsFor(client.user).has('SEND_MESSAGES')) await guild.systemChannel.send('This guild is blacklisted.');
      guild.leave();
      return;
    } catch {
      return;
    }
  } else if (guild.systemChannel && guild.systemChannel.permissionsFor(client.user).has('SEND_MESSAGES')) {
    try {
      await guild.systemChannel.send(`Hi! I'm ${client.user.username}, use ${client.settings.prefix}help to see my commands.`);
    } catch {
      // do nothing
    }
  }
};
module.exports = async (client, guild) => {
  if (client.blacklist.guild.includes(guild.id) || client.blacklist.user.includes(guild.ownerID)) {
    try {
      await guild.leave();
      return;
    } catch {
      return;
    }
  }
};
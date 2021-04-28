const { MessageEmbed } = require('discord.js');
module.exports = (client, messages) => {
  const guild = messages.first().guild;
  if (!guild) return;
  
  if (client.settings.get(guild.id).logsID) {
    if (guild.channels.cache.some(channel => channel.id == client.settings.get(guild.id).logsID)) {
      const logs = guild.channels.resolve(client.settings.get(guild.id).logsID);
      logs.send(new MessageEmbed()
        .setAuthor(guild.name, guild.iconURL())
        .setColor(0xeb5234)
        .setTimestamp()
        .setDescription(`**Bulk Delete in ${messages.first().channel}, ${messages.array().length} messages deleted**`)
      );
    }
  }
};

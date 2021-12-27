const { MessageEmbed } = require('discord.js');
module.exports = (client, messages) => {
  const guild = messages.first().guild;
  if (!guild) return;
  
  if (client.settings.get(guild.id).logsID) {
    if (guild.channels.cache.some(channel => channel.id == client.settings.get(guild.id).logsID)) {
      const logs = guild.channels.resolve(client.settings.get(guild.id).logsID);
      logs.send({embeds: [
        new MessageEmbed()
          .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
          .setColor(0xEB_52_34)
          .setTimestamp()
          .setDescription(`**Bulk Delete in ${messages.first().channel}, ${messages.size} messages deleted**`)
      ]});
    }
  }
};

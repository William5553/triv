const { MessageEmbed } = require('discord.js');
module.exports = (client, messages) => {
  const message = messages.first();
  if (!message.guild) return;
  const logs = message.guild.channels.cache.find(channel => channel.name === 'bot-logs');

  if (logs) logs.send(new MessageEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL())
    .setColor(0xeb5234)
    .setTimestamp()
    .setDescription(`**Bulk Delete in ${messages.first().channel}, ${messages.array().length} messages deleted**`)
  );
};

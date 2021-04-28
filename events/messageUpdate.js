const { MessageEmbed } = require('discord.js');
module.exports = (client, oldMessage, newMessage) => {
  if (!newMessage.content || !oldMessage.content || !newMessage.guild) return;
  
  const findLogs = newMessage.guild.channels.cache.find(channel => channel.name === 'bot-logs') || newMessage.guild.channels.cache.find(channel => channel.name === 'logs');
  if (findLogs)
    client.settings.set(newMessage.guild.id, findLogs.id, 'logsID');
  
  if (client.settings.get(newMessage.guild.id).logsID) {
    const logs = newMessage.guild.channels.resolve(client.settings.get(newMessage.guild.id).logsID);
    logs.send(new MessageEmbed()
      .setTitle('**Message Edited**')
      .setAuthor(`@${newMessage.author.tag} - #${newMessage.channel.name}`, newMessage.author.displayAvatarURL({ dynamic: true }))
      .setFooter(`User ID: ${newMessage.author.id} | Message ID: ${newMessage.id}`)
      .setTimestamp()
      .addField('**Old Message**', oldMessage.content, true)
      .addField('**New Message**', newMessage.content, true)
      .setColor('0xEB5234')
    );
  }
};

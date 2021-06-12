const { MessageEmbed } = require('discord.js');
module.exports = (client, oldMessage, newMessage) => {
  if (!newMessage.content || !oldMessage.content || !newMessage.guild) return;
  const { guild } = newMessage;
  
  const findLogs = guild.channels.cache.find(channel => channel.name === 'bot-logs' && channel.type == 'text') || guild.channels.cache.find(channel => channel.name === 'logs' && channel.type == 'text');
  if (findLogs)
    client.settings.set(guild.id, findLogs.id, 'logsID');
  
  if (client.settings.get(guild.id).logsID) {
    if (guild.channels.cache.some(channel => channel.id == client.settings.get(guild.id).logsID)) {
      const logs = guild.channels.resolve(client.settings.get(guild.id).logsID);
      logs.send({embeds: [
        new MessageEmbed()
          .setTitle('**Message Edited**')
          .setAuthor(`@${newMessage.author.tag} - #${newMessage.channel.name}`, newMessage.author.displayAvatarURL({ dynamic: true }))
          .setFooter(`User ID: ${newMessage.author.id} | Message ID: ${newMessage.id}`)
          .setTimestamp()
          .addField('**Old Message**', oldMessage.content, true)
          .addField('**New Message**', newMessage.content, true)
          .setColor('0xEB5234')
      ]});
    }
  }
};

const { MessageEmbed } = require('discord.js');
module.exports = (client, oldMessage, newMessage) => {
  if (!newMessage.content || !oldMessage.content || !newMessage.guild || oldMessage.partial) return;
  const { guild } = newMessage;
  
  const findLogs = guild.channels.cache.find(channel => channel.name === 'bot-logs' && channel.type == 'GUILD_TEXT') || guild.channels.cache.find(channel => channel.name === 'logs' && channel.type == 'GUILD_TEXT');
  if (findLogs)
    client.settings.set(guild.id, findLogs.id, 'logsID');
  
  if (client.settings.get(guild.id).logsID) {
    if (guild.channels.cache.some(channel => channel.id == client.settings.get(guild.id).logsID)) {
      const logs = guild.channels.resolve(client.settings.get(guild.id).logsID);
      logs.send({embeds: [
        new MessageEmbed()
          .setDescription(`**Message Edited in ${newMessage.channel}**`)
          .setAuthor({ name: `@${newMessage.author.tag} - #${newMessage.channel.name}`, iconURL: newMessage.author.displayAvatarURL({ dynamic: true })})
          .setFooter({ text: `User ID: ${newMessage.author.id} | Message ID: ${newMessage.id}` })
          .setTimestamp()
          .addField('**Before**', oldMessage.content)
          .addField('**After**', newMessage.content)
          .setColor('#ffd119')
      ]});
    }
  }
};

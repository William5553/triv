const { MessageEmbed } = require('discord.js');
module.exports = (client, oldMessage, newMessage) => {
  if (!newMessage.content || !oldMessage.content || !newMessage.guild) return;
  

  
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

const { MessageEmbed } = require('discord.js');
module.exports = (client, message) => {
  if (!message.guild) return;

  client.snipes.set(message.channel.id, {
    content: message.content,
    author: message.author,
    image: message.attachments.first() ? message.attachments.first().proxyURL : null,
    date: message.createdAt
  });

  const findLogs = message.guild.channels.cache.find(channel => channel.name === 'bot-logs') || message.guild.channels.cache.find(channel => channel.name === 'logs');
  if (findLogs) {
    client.settings.set(message.guild.id, findLogs.id, 'logsID')
  }

  if (client.settings.get(message.guild.id).logsID) {
    const logs = message.guild.channels.resolve(client.settings.get(message.guild.id).logsID);
    logs.send(new MessageEmbed()
      .setTitle('**Message Deleted**')
      .setAuthor(`@${message.author.tag} - #${message.channel.name}`, message.author.displayAvatarURL({ dynamic: true }))
      .setFooter(`User ID: ${message.author.id} | Message ID: ${message.id}`)
      .setTimestamp()
      .setDescription(`${message.content} ${message.embeds.length >= 1 ? `\n${message.embeds.length} embed${message.embeds.length == 1 ? '' : 's'} in message found, sending` : ''}${message.attachments.length >= 1 ? `\n${message.attachments.length} attachment${message.attachments.length == 1 ? '' : 's'} in message found, sending` : ''}`)
      .setColor('0xEB5234')
    );
    message.embeds.forEach(embed => {
      logs.send(embed);
    });
    message.attachments.forEach(embed => {
      logs.send(embed);
    });
    logs.updateOverwrite(message.channel.guild.roles.everyone, {
      SEND_MESSAGES: false
    });
  }
};

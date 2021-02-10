const { MessageEmbed } = require('discord.js');
module.exports = (client, message) => {
  if (!message.guild) return;
  const logs = message.guild.channels.cache.find(channel => channel.name === 'bot-logs');
  if (message.guild.me.hasPermission('MANAGE_CHANNELS') && !logs)
    message.guild.channels.create('bot-logs', { type: 'text' });

  if (logs) {
    logs.send(new MessageEmbed()
      .setTitle('**Message Deleted**')
      .setAuthor(`@${message.author.tag} - #${message.channel.name}`, message.author.avatarURL())
      .setFooter(`User ID: ${message.author.id} | Message ID: ${message.id}`)
      .setTimestamp()
      .setDescription(`${message.content} ${message.embeds ? `\n${message.embeds.length} embed${message.embeds.length == 1 ? '' : 's'} in message found, sending` : ''}`)
      .setColor('0xEB5234')
    );
    message.embeds.forEach(embed => {
      logs.send(embed);
    });
    logs.updateOverwrite(message.channel.guild.roles.everyone, {
      SEND_MESSAGES: false
    });
  }
};

const { MessageEmbed } = require('discord.js');
module.exports = message => {
  if (!message.guild) return;
  const logs = message.guild.channels.cache.find(channel => channel.name === 'bot-logs');
  if (message.guild.me.hasPermission('MANAGE_CHANNELS') && !logs)
    message.guild.channels.create('bot-logs', { type: 'text' });

  const embed = new MessageEmbed()
    .setTitle('**Message Deleted**')
    .setAuthor(`@${message.author.tag} - #${message.channel.name}`, message.author.avatarURL())
    .setFooter(`User ID: ${message.author.id}`)
    .setTimestamp()
    .setDescription(message.content)
    .setColor('0xEB5234');
  if (logs) {
    logs.send(embed);
    logs.updateOverwrite(message.channel.guild.roles.everyone, {
      SEND_MESSAGES: false,
    });
  }
};

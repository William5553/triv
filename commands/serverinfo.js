const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
  const owner = message.guild.fetchOwner();
  
  return message.channel.send({ embeds: [
    new MessageEmbed()
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setFooter({ iconURL: owner.displayAvatarURL({ dynamic: true }), text: `Owner: ${owner.user.tag} | ID: ${message.guild.id}` })
      .addField('Server Created', `<t:${message.guild.createdTimestamp}>:f`)
      .addField('Member Count', message.guild.memberCount)
      .addField('Ban Count', message.guild.bans.cache.size)
      .addField('Text Channels', message.guild.channels.cache.filter(channel => channel.isText() && !channel.isThread()).size)
      .addField('Voice Channels', message.guild.channels.cache.filter(channel => channel.isVoice()).size)
      .addField('Roles', message.guild.roles.cache.size)
  ]});
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['guildinfo', 'guild'],
  permLevel: 0,
  cooldown: 2000
};

exports.help = {
  name: 'serverinfo',
  description: 'Responds with detailed information about the current server',
  usage: 'serverinfo'
};

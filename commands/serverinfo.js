const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
  await message.guild.fetch();
  const owner = await message.guild.fetchOwner();
  
  message.channel.send({ embeds: [
    new MessageEmbed()
      .setColor('RANDOM')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setFooter({ iconURL: owner.displayAvatarURL({ dynamic: true }), text: `Owner: ${owner.user.tag} | ID: ${message.guild.id}` })
      .addField('Server Created', `<t:${Math.round(message.guild.createdTimestamp / 1000)}:f>`, true)
      .addField('Member Count', `${message.guild.memberCount ?? message.guild.approximateMemberCount}`, true)
      .addField('Ban Count', `${message.guild.bans.cache.size}`, true)
      .addField('Text Channels', `${message.guild.channels.cache.filter(channel => channel.isText() && !channel.isThread()).size}`, true)
      .addField('Voice Channels', `${message.guild.channels.cache.filter(channel => channel.isVoice()).size}`, true)
      .addField('Roles', `${message.guild.roles.cache.size}`, true)
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

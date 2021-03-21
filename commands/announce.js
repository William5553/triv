const { MessageEmbed } = require('discord.js');

exports.run = (client, message, args) => {
  if (!args[0]) return message.reply('please tell me a message to announce next time.');
  const msg = args.join(' ');
  const guilds = [];
  client.guilds.cache.forEach(guild => {
    if (guild.systemChannel && guild.systemChannel.viewable && guild.systemChannel.permissionsFor(guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])) {
      guild.systemChannel.send(new MessageEmbed()
        .setTitle(`**${client.user.username.toUpperCase()} ANNOUNCEMENT**`)
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setDescription(msg)
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor)
      );
    } else guilds.push(guild.name);
  });
  
  if (guilds.length > 0) {
    message.channel.send(new MessageEmbed()
      .setTitle('Announcement Failures')
      .setDescription(guilds.join('\n'))
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor)
    );
  }
}; 

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 10
};
    
exports.help = {
  name: 'announce',
  description: 'Announces a message to every guild the bot is in.',
  usage: 'announce [message]'
};
    
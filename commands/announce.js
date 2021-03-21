const { MessageEmbed } = require('discord.js');

exports.run = (client, message, args) => {
  if (!args[0]) return message.reply('please tell me a message to announce next time.');
  const guilds = [];
  client.guilds.cache.forEach(guild => {
    if (guild.systemChannel && guild.systemChannel.viewable && guild.systemChannel.permissionsFor(guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])) {
      guild.systemChannel.send(new MessageEmbed()
        .setTitle(`**${client.user.username.toUpperCase()} ANNOUNCEMENT**`)
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setDescription(args.join(' '))
        .setTimestamp()
        .setColor('FF0000')
      );
    } else guilds.push(`${guild.name} - ${guild.id}`);
  });
  
  if (guilds.length > 0) {
    message.channel.send(new MessageEmbed()
      .setTitle('Announcement Failures')
      .setDescription(guilds.join('\n'))
      .setTimestamp()
      .setColor('FF0000')
    );
  } else {
    message.channel.send('Successfully announced message to all guilds.');
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
    
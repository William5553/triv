const { MessageEmbed, Permissions } = require('discord.js');

exports.run = (client, message, args) => {
  try {
    if (!args[0]) return message.reply('Tell me what to announce next time.');
    const guilds = [];
    for (const guild of client.guilds.cache) {
      if (guild.systemChannel && guild.systemChannel.viewable && guild.systemChannel.permissionsFor(guild.me).has([Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.EMBED_LINKS])) {
        guild.systemChannel.send({embeds: [
          new MessageEmbed()
            .setTitle(`**${client.user.username.toUpperCase()} ANNOUNCEMENT**`)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(args.join(' '))
            .setTimestamp()
            .setColor('FF0000')
        ]});
      } else guilds.push(`${guild.name} - ${guild.id}`);
    }
  
    if (guilds.length > 0) {
      message.channel.send({embeds: [
        new MessageEmbed()
          .setTitle('Announcement Failures')
          .setDescription(guilds.join('\n'))
          .setTimestamp()
          .setColor('FF0000')
      ]});
    } else
      message.reply('Successfully announced message to all guilds.');
  } catch (error) {
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor('#FF0000')
        .setTimestamp()
        .setTitle('Please report this on GitHub')
        .setURL('https://github.com/william5553/triv/issues')
        .setDescription(`**Stack Trace:**\n\`\`\`${error.stack || error}\`\`\``)
        .addField('**Command:**', message.content)
    ]});
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
    
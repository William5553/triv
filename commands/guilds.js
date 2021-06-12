const { MessageEmbed, Permissions } = require('discord.js');

exports.run = (client, message) => {
  try {
    const link = client.generateInvite({ permissions: Permissions.ALL });
    message.channel.send({embeds: [new MessageEmbed()
      .setColor(0x00ff5c)
      .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
      .setTitle(`**${client.guilds.cache.size} guild(s)**`)
      .setDescription(`${client.guilds.cache.map(g => `${g.name} - ${g.id}`).join('\n')}`)
      .setURL(client.application.botPublic ? link : 'https://github.com/william5553/triv')
      .setTimestamp()
    ]});
  } catch (err) {
    return message.channel.send({embeds: [new MessageEmbed()
      .setColor('#FF0000')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`**Stack Trace:**\n\`\`\`${err.stack}\`\`\``)
      .addField('**Command:**', `${message.content}`)
    ]});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['servers'],
  permLevel: 10
};

exports.help = {
  name: 'guilds',
  description: "Shows all the guilds I'm in",
  usage: 'guilds',
  example: 'guilds'
};

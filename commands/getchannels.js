const { MessageEmbed } = require('discord.js'); 

exports.run = async (client, message, args) => {
  try {
    if (Number.isNaN(args[0])) return message.reply('Please provide a valid guild ID.');
    const guild = client.guilds.resolve(args[0]);
    if (!guild) return message.channel.send('Unable to find server, please check the provided ID');
    message.channel.send({embeds: [new MessageEmbed()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
      .setTimestamp()
      .setDescription(guild.channels.cache.map(c => `${c.name} - ${c.type}`).join('\n'))
      .setColor('BLURPLE')
    ]});
  } catch (error) {
    return message.channel.send({embeds: [new MessageEmbed()
      .setColor('#FF0000')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`**Stack Trace:**\n\`\`\`${error.stack ?? error}\`\`\``)
      .addField('**Command:**', message.content)
    ]});
  }
};
  
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['getchan'],
  permLevel: 10
};
  
exports.help = {
  name: 'getchannels',
  description: 'Gets a list of channels for the specified guild ID',
  usage: 'getchannels [guild id]'
};
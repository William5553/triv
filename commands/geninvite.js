const { MessageEmbed } = require('discord.js'); 

exports.run = async (client, message, args) => {
  try {
    if (!args[0] || isNaN(args[0])) return message.reply('please provide a valid guild ID.');
    const guild = client.guilds.resolve(args[0]);
    if (!guild) return message.channel.send('Unable to find server, please check the provided ID');
    const inv = await guild.channels.cache.random().createInvite({ maxAge: 0, maxUses: 0 });
    message.channel.send(inv.url);
  } catch (err) {
    return message.channel.send({embeds: [new MessageEmbed()
      .setColor('#FF0000')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`**Stack Trace:**\n\`\`\`${err.stack || err}\`\`\``)
      .addField('**Command:**', `${message.content}`)
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
  name: 'geninvite',
  description: 'Makes an invite for the guild specified and sends it',
  usage: 'geninvite [guild id]'
};
  
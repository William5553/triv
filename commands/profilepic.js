const { MessageEmbed } = require('discord.js');
const possibleFormats = ['webp', 'png', 'jpg', 'jpeg', 'gif'];

exports.run = (client, message, args) => {
  try {
    if (args.length < 1) return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage} (formats: ${possibleFormats.join(', ')})`);
    if (!possibleFormats.includes(args[0])) return message.reply(`Invalid format, valid formats: ${possibleFormats.join(', ')}`);
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.slice(1).join(' ').toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.slice(1).join(' ').toLowerCase()) || message.member;
    if (!member) return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
    message.channel.send(member.user.displayAvatarURL({ size: 4096, dynamic: true, format: args[0] }));
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
  guildOnly: true,
  aliases: ['pfp'],
  permLevel: 0,
  cooldown: 1250
};

exports.help = {
  name: 'profilepic',
  description: 'Gets the profile picture of a user',
  usage: 'profilepic [format] [user]',
  example: 'profilepic gif @William5553'
};

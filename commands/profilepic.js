const { MessageEmbed } = require('discord.js');
const possibleFormats = ['webp', 'png', 'jpg', 'jpeg', 'gif'];

exports.run = (client, message, args) => {
  try {
    if (args.length < 2) return message.reply(`usage: ${client.getPrefix(message)}${exports.help.usage} (formats: ${possibleFormats.join(', ')})`);
    if (!possibleFormats.includes(args[0])) return message.reply(`Invalid format, valid formats: ${possibleFormats}`);
    const member = message.mentions.members.first() || message.guild.members.cache.get(args.splice(1).join(' ')) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.splice(1).join(' ').toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.splice(1).join(' ').toLowerCase());
    if (!member) return message.reply(`usage: ${client.getPrefix()}${exports.help.usage}`);
    message.channel.send(member.user.displayAvatarURL({ size: 4096, dynamic: true, format: args[0] }));
  } catch (err) {
    return message.channel.send(new MessageEmbed()
      .setColor('#FF0000')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`**Stack Trace:**\n\`\`\`${err.stack}\`\`\``)
      .addField('**Command:**', `${message.content}`)
    );
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0,
  cooldown: 1000
};

exports.help = {
  name: 'profilepic',
  description: 'Gets the profile picture of a user',
  usage: 'profilepic [format] [user]'
};

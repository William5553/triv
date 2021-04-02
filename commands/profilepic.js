const { MessageEmbed } = require('discord.js');

exports.run = (client, message, args) => {
  try {
    if (args.length < 1) return message.reply(`usage: ${client.getPrefix()}${exports.help.usage}`);
    const member = message.mentions.members.first() || message.guild.members.cache.get(args.join(' ')) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLowerCase());
    message.channel.send(member.user.displayAvatarURL({size: 4096, dynamic: true}));
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
  usage: 'profilepic [user]'
};

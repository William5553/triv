const { MessageEmbed, Permissions } = require('discord.js');

exports.run = (client, message) => {
  try {
    if (!client.application.botPublic && !client.owners.includes(message.author.id)) return message.reply('The bot is private.');
    const url = client.generateInvite({ permissions: Permissions.ALL, scopes: ['bot'] });
    message.reply({embeds: [
      new MessageEmbed()
        .setColor(0x00_AE_86)
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }), url})
        .setDescription(`[Invite me](${url})`)
    ]});
  } catch (error) {
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor('#FF0000')
        .setTimestamp()
        .setTitle('Please report this on GitHub')
        .setURL('https://github.com/william5553/triv/issues')
        .setDescription(`**Stack Trace:**\n\`\`\`${error.stack}\`\`\``)
        .addFields({ name: '**Command:**', value: message.content })
    ]});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['inv'],
  permLevel: 0,
  cooldown: 2000
};

exports.help = {
  name: 'invite',
  description: 'Gives you an invite link for me.',
  usage: 'invite',
  example: 'invite'
};

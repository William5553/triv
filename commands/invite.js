const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
  if (!client.application.botPublic && !client.owners.includes(message.author.id)) return message.reply('the bot is private.');
  const link = await client.generateInvite({ permissions: 2146958591 }).catch(message.channel.send);
  message.channel.send(new MessageEmbed()
    .setColor(0x00ae86)
    .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
    .setDescription(`[Invite me](${link})`)
  );
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['inv'],
  permLevel: 0,
  cooldown: 1500
};

exports.help = {
  name: 'invite',
  description: 'Gives you an invite link for me.',
  usage: 'invite',
  example: 'invite'
};

const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
  const link = await client.generateInvite({ permissions: 2146958591 }).catch(message.channel.send);
  message.channel.send(new MessageEmbed()
    .setColor(0x00ff5c)
    .setAuthor(client.user.username, client.user.avatarURL())
    .setTitle(`**${client.guilds.cache.size} guild(s)**`)
    .setDescription(`${client.guilds.cache.map(g => `${g.name} - ${g.id}`).join('\n')}`)
    .setURL(client.application.botPublic ? link : 'https://github.com/william5553/triv')
    .setTimestamp()
  );
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['servers'],
  permLevel: 10
};

exports.help = {
  name: 'guilds',
  description: 'Shows all my guilds.',
  usage: 'guilds'
};

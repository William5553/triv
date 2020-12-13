const { MessageEmbed } = require('discord.js');
exports.run = (client, message) => {
  client.generateInvite({ permissions: 2146958591 }).then(link => {
    message.channel.send(new MessageEmbed()
      .setColor(0x00ff5c)
      .setAuthor(client.user.username, client.user.avatarURL())
      .setTitle(`**${client.guilds.cache.size} guild(s)**`)
      .setDescription(`${client.guilds.cache.map(g => `${g.name} - ${g.id}`).join('\n')}`)
      .setURL(link)
      .setTimestamp()
    );
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 10
};

exports.help = {
  name: 'guilds',
  description: 'Shows all my guilds.',
  usage: 'guilds'
};

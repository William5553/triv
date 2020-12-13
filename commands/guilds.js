const { MessageEmbed } = require('discord.js');
exports.run = (client, message) => {
  message.channel.send(new MessageEmbed()
    .setColor(0x00ff5c)
    .setAuthor(client.user.username, client.user.avatarURL())
    .setDescription(`**${client.guilds.cache.size} guild(s):**\n\n*${client.guilds.cache.map(g => `${g.name} - ${g.id}`).join('\n')}*`)
    .setURL('https://discordapp.com/oauth2/authorize?client_id=340942145051426828&scope=bot&permissions=536308991')
    .setTimestamp()
  );
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

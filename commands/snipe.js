const { MessageEmbed } = require('discord.js');

exports.run = (client, message) => {
  const msg = client.snipes.get(message.channel.id);
  
  if (!msg) return message.reply('No message to snipe.');

  message.channel.send({embeds: [
    new MessageEmbed()
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true }))
      .setDescription(msg.content)
      .setTimestamp(msg.date)
      .setColor('FF0000')
  ]});
};
  
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0,
  cooldown: 3000
};
  
exports.help = {
  name: 'snipe',
  description: "Gets a user's ID",
  usage: 'snipe',
  example: 'snipe'
};
  
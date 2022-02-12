const { MessageEmbed } = require('discord.js');

exports.run = (client, message) => {
  const msg = client.snipes.get(message.channel.id);
  if (!msg) return message.reply('No message to snipe.');

  message.channel.send({embeds: [
    new MessageEmbed()
      .setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL({ dynamic: true }) })
      .setDescription(msg.content)
      .setFooter({ text: `User ID: ${msg.author.id}` })
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
  description: "Gets the last deleted message in the text channel it's ran in",
  usage: 'snipe',
  example: 'snipe'
};
  

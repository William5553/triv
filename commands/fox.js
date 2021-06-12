const fetch = require('node-superfetch');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
  try {
    const { body } = await fetch.get('https://randomfox.ca/floof/');
    const embed = new MessageEmbed()
      .setTitle(':fox: What does the fox say? :fox:')
      .setImage(body.image)
      .setTimestamp()
      .setColor('FF0000');
    message.channel.send({ embeds: [embed] });
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
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  cooldown: 1500
};
  
exports.help = {
  name: 'fox',
  description: 'Find a random fox for your viewing pleasure. What does the fox say?',
  usage: 'fox',
  example: 'fox'
};
  
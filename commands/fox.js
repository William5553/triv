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
    message.channel.send(embed);
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
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  cooldown: 1000
};
  
exports.help = {
  name: 'fox',
  description: 'Find a random fox for your viewing pleasure. What does the fox say?',
  usage: 'fox'
};
  
const fetch = require('node-superfetch');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
  try {
    const { body } = await fetch.get('https://random-d.uk/api/v2/random');
    const embed = new MessageEmbed()
      .setTitle(':duck: Quack! :duck:')
      .setImage(body.url)
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
  aliases: ['quack'],
  permLevel: 0,
  cooldown: 1000
};
        
exports.help = {
  name: 'duck',
  description: 'Finds a random duck for your viewing pleasure.',
  usage: 'duck'
};
        
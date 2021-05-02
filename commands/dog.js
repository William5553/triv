const fetch = require('node-superfetch');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
  try {
    const { text } = await fetch.get('http://random.dog/woof');
    const embed = new MessageEmbed()
      .setTitle(':dog: Woof! :dog:')
      .setImage(`http://random.dog/${text}`)
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
  aliases: ['woof', 'bark'],
  permLevel: 0,
  cooldown: 1500
};
  
exports.help = {
  name: 'dog',
  description: 'Finds a random dog for your viewing pleasure.',
  usage: 'dog',
  example: 'dog'
};
  
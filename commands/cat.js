const fetch = require('node-superfetch');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
  try {
    const { body } = await fetch.get('http://aws.random.cat/meow');
    const embed = new MessageEmbed()
      .setTitle(':cat: Meow! :cat:')
      .setImage(body.file)
      .setColor('FF0000');
    message.channel.send({ embeds: [embed] });
  } catch (error) {
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor('#FF0000')
        .setTimestamp()
        .setTitle('Please report this on GitHub')
        .setURL('https://github.com/william5553/triv/issues')
        .setDescription(`**Stack Trace:**\n\`\`\`${error.stack ?? error}\`\`\``)
        .addField('**Command:**', message.content)
    ]});
  }
};
  
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['meow', 'pussy'],
  permLevel: 0,
  cooldown: 1500
};
  
exports.help = {
  name: 'cat',
  description: 'Finds a random cat for your viewing pleasure.',
  usage: 'cat',
  example: 'cat'
};
  
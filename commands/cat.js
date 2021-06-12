const fetch = require('node-superfetch');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
  try {
    const { body } = await fetch.get('http://aws.random.cat/meow');
    const embed = new MessageEmbed()
      .setTitle(':cat: Meow! :cat:')
      .setImage(body.file)
      .setTimestamp()
      .setColor('FF0000');
    message.channel.send(embed);
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
  aliases: ['meow'],
  permLevel: 0,
  cooldown: 1500
};
  
exports.help = {
  name: 'cat',
  description: 'Finds a random cat for your viewing pleasure.',
  usage: 'cat',
  example: 'cat'
};
  
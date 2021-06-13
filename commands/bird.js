const fetch = require('node-superfetch');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
  try {
    const { body } = await fetch.get('http://shibe.online/api/birds');
    message.channel.send({embeds: [
      new MessageEmbed()
        .setTitle(':bird: Chirp! :bird:')
        .setImage(body[0])
        .setColor('FF0000')
    ]});
  } catch (err) {
    return message.channel.send({embeds: [
      new MessageEmbed()
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
  aliases: ['chirp'],
  permLevel: 0,
  cooldown: 1500
};
      
exports.help = {
  name: 'bird',
  description: 'Finds a random bird for your viewing pleasure.',
  usage: 'bird',
  example: 'bird'
};
      
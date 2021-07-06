const fetch = require('node-superfetch');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
  try {
    const { body } = await fetch.get('https://uselessfacts.jsph.pl/random.json?language=en');
    message.channel.send(body.text);
  } catch (err) {
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor('#FF0000')
        .setTimestamp()
        .setTitle('Please report this on GitHub')
        .setURL('https://github.com/william5553/triv/issues')
        .setDescription(`**Stack Trace:**\n\`\`\`${err.stack || err}\`\`\``)
        .addField('**Command:**', message.content)
    ]});
  }
};
  
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  cooldown: 2000
};
  
exports.help = {
  name: 'fact',
  description: 'Sends a random fact',
  usage: 'fact',
  example: 'fact'
};
  

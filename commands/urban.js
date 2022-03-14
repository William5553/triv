const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');

exports.run = async (client, message, args) => {
  try {
    const word = args.join(' ').split('|')[0];
    let resultN = Number(args.join(' ').split('|')[1])-1;
    if (!word) return message.channel.send('Specify a word');
    if (!resultN || Number.isNaN(resultN) || resultN <= 0) resultN = 0;
    const { body } = await request
      .get('http://api.urbandictionary.com/v0/define')
      .query({ term: word });
    if (body.list.length === 0) return message.channel.send('Could not find any results');
    const data = body.list[resultN];
    return message.channel.send({embeds: [new MessageEmbed()
      .setColor(0x32_A8_F0)
      .setAuthor({ name: 'Urban Dictionary', iconURL: 'https://i.imgur.com/Fo0nRTe.png', url: data.permalink })
      .setURL(data.permalink)
      .setTitle(data.word)
      .setDescription(data.definition.replaceAll('[|]', '').slice(0, 1200))
      .setFooter({ text: `Author: ${data.author} | 👍 ${data.thumbs_up} 👎 ${data.thumbs_down}` })
      .setTimestamp(new Date(data.written_on))
      .addField('Example', data.example ? data.example.replaceAll('[|]', '').slice(0, 800) : 'None')
    ]});
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
  aliases: ['ud', 'define'],
  permLevel: 0,
  cooldown: 2000
};

exports.help = {
  name: 'urban',
  description: 'Searches for a term on the urban dictionary',
  usage: 'urban [term|result #]',
  example: 'urban dark blockchain'
};

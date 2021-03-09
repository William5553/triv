const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');

exports.run = async (client, message, args) => {
  try {
    const word = args.join(' ').split('|')[0];
    let resultN = Number(args.join(' ').split('|')[1])-1;
    if (!word) return message.channel.send('Specify a word');
    if (!resultN || isNaN(resultN) || resultN <= 0) resultN = 0;
    const { body } = await request
      .get('http://api.urbandictionary.com/v0/define')
      .query({ term: word });
    if (!body.list.length) return message.channel.send('Could not find any results');
    const data = body.list[resultN];
    return message.channel.send(new MessageEmbed()
      .setColor(0x32A8F0)
      .setAuthor('Urban Dictionary', 'https://i.imgur.com/Fo0nRTe.png', 'https://www.urbandictionary.com/')
      .setURL(data.permalink)
      .setTitle(data.word)
      .setDescription(data.definition.replace(/\[|\]/g, '').substr(0, 1200))
      .setFooter(`Author: ${data.author} | 👍 ${data.thumbs_up} 👎 ${data.thumbs_down}`)
      .setTimestamp(new Date(data.written_on))
      .addField('❯ Example', data.example ? data.example.replace(/\[|\]/g, '').substr(0, 800) : 'None')
    ).catch(client.logger.error);
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
  aliases: ['ud', 'define'],
  permLevel: 0
};

exports.help = {
  name: 'urban',
  description: 'Searches for a term on the urban dictionary',
  usage: 'urban [term|result #]',
  example: 'urban dark blockchain'
};

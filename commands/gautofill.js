const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  const query = args.join(' ');
  if (!query) return message.reply('Please specify a search query');
  try {
    const { text } = await request
      .get('https://suggestqueries.google.com/complete/search')
      .query({
        client: 'firefox',
        q: query
      });
    const data = JSON.parse(text)[1];
    if (data.length === 0) return message.channel.send('Could not find any results.');
    return message.channel.send(data.join('\n'));
  } catch (error) {
    return message.channel.send({embeds: [new MessageEmbed()
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
  aliases: ['gauto', 'autofill'],
  permLevel: 0,
  cooldown: 2000
};

exports.help = {
  name: 'gautofill',
  description: 'Responds with a list of the Google Autofill results for a particular query',
  usage: 'gautofill [query]',
  example: 'gautofill how to'
};

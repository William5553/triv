const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    if (!process.env.google_api_key) return message.reply('the bot owner has not set up this command yet');
    if (!args[0]) return message.reply(`Usage: ${exports.help.usage}`);
    const text = args.join(' ');
    const { body } = await request
        .post('https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze')
        .query({ key: process.env.google_api_key })
        .send({
          comment: { text },
          languages: ['en'],
          requestedAttributes: { TOXICITY: {} }
        }),
      toxicity = Math.round(body.attributeScores.TOXICITY.summaryScore.value * 100);
    if (toxicity >= 70) return message.reply(`Likely to be perceived as toxic. (${toxicity}%)`);
    if (toxicity >= 40) return message.reply(`Unsure if this will be perceived as toxic. (${toxicity}%)`);
    return message.reply(`Unlikely to be perceived as toxic. (${toxicity}%)`);
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
  aliases: ['toxic'],
  permLevel: 0,
  cooldown: 2500
};

exports.help = {
  name: 'toxicity',
  description: 'Determines the toxicity of text',
  usage: 'toxicity [text]',
  example: 'toxicity fart'
};

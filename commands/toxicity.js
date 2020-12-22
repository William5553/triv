const request = require('node-superfetch'),
  { MessageEmbed } = require('discord.js');

exports.run = async (client, msg, args) => {
  try {
    const text = args.join(' '),
      { body } = await request
        .post('https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze')
        .query({ key: client.settings.google_api_key })
        .send({
          comment: { text },
          languages: ['en'],
          requestedAttributes: { TOXICITY: {} }
        }),
      toxicity = Math.round(body.attributeScores.TOXICITY.summaryScore.value * 100);
    if (toxicity >= 70) return msg.reply(`Likely to be perceived as toxic. (${toxicity}%)`);
    if (toxicity >= 40) return msg.reply(`Unsure if this will be perceived as toxic. (${toxicity}%)`);
    return msg.reply(`Unlikely to be perceived as toxic. (${toxicity}%)`);
  } catch (err) {
    return msg.channel.send(new MessageEmbed()
      .setColor('RED')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`Stack Trace: \n\`\`\`${err.stack}\`\`\``)
      .addField('Command:', `${msg.content}`)
    );
  }
};
  
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'toxicity',
  description: 'Determines the toxicity of text',
  usage: 'toxicity [text]'
};

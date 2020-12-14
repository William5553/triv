const request = require('node-superfetch');

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
    return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
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

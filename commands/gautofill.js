const request = require('node-superfetch');

exports.run = async (client, message, args) => {
  const query = args.join(' ');
  if (!query) return message.reply('please specify a search query');
  try {
    const { text } = await request
      .get('https://suggestqueries.google.com/complete/search')
      .query({
        client: 'firefox',
        q: query
      });
    const data = JSON.parse(text)[1];
    if (!data.length) return message.channel.send('Could not find any results.');
    return message.channel.send(data.join('\n'));
  } catch (err) {
    return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['gauto'],
  permLevel: 0
};

exports.help = {
  name: 'gautofill',
  description: 'Responds with a list of the Google Autofill results for a particular query',
  usage: 'gautofill [query]',
  example: 'gautofill how to'
};
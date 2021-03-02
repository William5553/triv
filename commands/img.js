const fetch = require('node-superfetch'),
  { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    if (!process.env.rapidapi_key) return message.reply('the bot owner has not set up this command yet');
    if (args.length < 3 || isNaN(args[0])) return message.channel.send(`${process.env.prefix}${exports.help.usage}`);
    const safeSearch = !message.channel.nsfw;
    const query = args.splice(2).join(' ');
    const { body } = await fetch
      .get('https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI')
      .query({
        q: query,
        pageNumber: args[0],
        pageSize: 50,
        autoCorrect: false,
        safeSearch
      })
      .set({
        'x-rapidapi-key': process.env.rapidapi_key,
        'x-rapidapi-host': 'contextualwebsearch-websearch-v1.p.rapidapi.com',
        useQueryString: true
      });
    const img = !isNaN(args[1]) ? body.value[args[1]] : body.value.random();
    if (!body.value || !img || !img.url || !img.title) return message.reply('no results');
    message.channel.send(new MessageEmbed()
      .setTitle(`**${img.title}**`)
      .setColor('BLURPLE')
      .setURL(img.webpageUrl)
      .setImage(img.url)
      .setFooter(`Showing page ${args[0]} (50 per page), result ${!isNaN(args[1]) ? args[1] : 'random'} of ${body.value.length} for query ${query}`)
    );
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
  aliases: ['image'],
  permLevel: 0
};

exports.help = {
  name: 'img',
  description: 'Fetches a random image from image results for your search query',
  usage: 'img [page] [position OR random] [search query]'
};

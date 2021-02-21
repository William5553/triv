const { MessageEmbed } = require('discord.js'),
  request = require('node-superfetch');

exports.run = async (client, message, args) => {
  try {
    let query = args.join(' ');
    if (query.length < 1) return message.reply('tell me a country moron');
    query = encodeURIComponent(query);
    const { body } = await request.get(`https://restcountries.eu/rest/v2/name/${query}`);
    const data = body[0];
    return message.channel.send(new MessageEmbed()
      .setColor(0x00AE86)
      .setTitle(data.name)
      .setThumbnail(`https://www.countryflags.io/${data.alpha2Code}/flat/64.png`)
      .addField('❯ Population', data.population, true)
      .addField('❯ Capital', data.capital || 'None', true)
      .addField('❯ Currency', data.currencies[0].symbol, true)
      .addField('❯ Location', data.subregion || data.region, true)
      .addField('❯ Demonym', data.demonym || 'None', true)
      .addField('❯ Native Name', data.nativeName, true)
      .addField('❯ Area', `${data.area} km`, true)
      .addField('❯ Languages', data.languages.map(lang => lang.name).join('/'))
    );
  } catch (err) {
    if (err.status === 404) return message.channel.send('Could not find any results.');
    return message.channel.send(new MessageEmbed()
      .setColor('RED')
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
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'country',
  description: 'Gives information about a country',
  usage: 'country [country]',
  example: 'country Venezuela'
};
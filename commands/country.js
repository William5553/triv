const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { formatNumber } = require('../util/Util');

exports.run = async (client, message, args) => {
  try {
    if (args.length === 0)
      return message.reply('Tell me a country, moron');
    const query = encodeURIComponent(args.join(' '));
    const { body } = await request.get(`https://restcountries.eu/rest/v2/name/${query}`);
    const data = body[0];
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor(0x00_AE_86)
        .setTitle(data.name)
        .setThumbnail(`https://www.countryflags.io/${data.alpha2Code}/flat/64.png`)
        .addField('❯ Population', formatNumber(data.population), true)
        .addField('❯ Capital', data.capital || 'None', true)
        .addField('❯ Currency', data.currencies[0].symbol, true)
        .addField('❯ Location', data.subregion || data.region, true)
        .addField('❯ Demonym', data.demonym || 'None', true)
        .addField('❯ Native Name', data.nativeName, true)
        .addField('❯ Area', `${formatNumber(data.area)} km`, true)
        .addField('❯ Languages', data.languages.map(lang => lang.name).join('/'))
    ]});
  } catch (error) {
    if (error.status === 404) return message.channel.send('Could not find any results.');
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
  aliases: [],
  permLevel: 0,
  cooldown: 3000
};

exports.help = {
  name: 'country',
  description: 'Gives information about a country',
  usage: 'country [country]',
  example: 'country Venezuela'
};
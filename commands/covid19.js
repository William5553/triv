const request = require('node-superfetch');
const { formatNumber } = require('../util/Util');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    if (args.size < 1) return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
    const country = args[0];
    const data = await fetchStats(country);
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor(0xA2D84E)
        .setAuthor('Worldometers', 'https://i.imgur.com/IoaBMuK.jpg', 'https://www.worldometers.info/coronavirus/')
        .setTitle(`Stats for ${country === 'all' ? 'the World' : data.country}`)
        .setURL(country === 'all'
          ? 'https://www.worldometers.info/coronavirus/'
          : `https://www.worldometers.info/coronavirus/country/${data.countryInfo.iso2}/`)
        .setThumbnail(country === 'all' ? null : data.countryInfo.flag || null)
        .setFooter('Last Updated')
        .setTimestamp(data.updated)
        .addField('❯ Total Cases', `${formatNumber(data.cases)} (${formatNumber(data.todayCases)} today)`, true)
        .addField('❯ Total Deaths', `${formatNumber(data.deaths)} (${formatNumber(data.todayDeaths)} today)`, true)
        .addField('❯ Total Recoveries',
          `${formatNumber(data.recovered)} (${formatNumber(data.todayRecovered)} today)`, true)
        .addField('❯ Active Cases', formatNumber(data.active), true)
        .addField('❯ Active Critical Cases', formatNumber(data.critical), true)
        .addField('❯ Tests', formatNumber(data.tests), true)
    ]});
  } catch (err) {
    if (err.status === 404) return message.say("Country not found or doesn't have any cases.");
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor('#FF0000')
        .setTimestamp()
        .setTitle('Please report this on GitHub')
        .setURL('https://github.com/william5553/triv/issues')
        .setDescription(`**Stack Trace:**\n\`\`\`${err.stack || err}\`\`\``)
        .addField('**Command:**', message.content)
    ]});
  }
};
const fetchStats = async country => {
  const { body } = await request.get(`https://disease.sh/v3/covid-19/${country === 'all' ? 'all' : `countries/${country}`}`);
  return body;
};
  
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['covid', 'corona', 'coronavirus'],
  permLevel: 0,
  cooldown: 5000
};

exports.help = {
  name: 'covid19',
  description: 'Responds with stats for COVID-19',
  usage: 'covid19 [country]',
  example: 'covid19 USA'
};

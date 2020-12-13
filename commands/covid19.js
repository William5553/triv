const request = require('node-superfetch'),
  { MessageEmbed } = require('discord.js'),
  settings = require('../settings.json');

exports.run = async (client, msg, args) => {
  try {
    if (args.size < 1) return msg.reply(`${settings.prefix}${exports.help.usage}`);
    const country = args[0];
    const data = await fetchStats(country);
    return msg.channel.send(new MessageEmbed()
      .setColor(0xA2D84E)
      .setAuthor('Worldometers', 'https://i.imgur.com/IoaBMuK.jpg', 'https://www.worldometers.info/coronavirus/')
      .setTitle(`Stats for ${country === 'all' ? 'The World' : data.country}`)
      .setURL(country === 'all'
        ? 'https://www.worldometers.info/coronavirus/'
        : `https://www.worldometers.info/coronavirus/country/${data.countryInfo.iso2}/`)
      .setThumbnail(country === 'all' ? null : data.countryInfo.flag || null)
      .setFooter('Last Updated')
      .setTimestamp(data.updated)
      .addField('❯ Total Cases', `${formatNumber(data.cases)} (${formatNumber(data.todayCases)} Today)`, true)
      .addField('❯ Total Deaths', `${formatNumber(data.deaths)} (${formatNumber(data.todayDeaths)} Today)`, true)
      .addField('❯ Total Recoveries',
        `${formatNumber(data.recovered)} (${formatNumber(data.todayRecovered)} Today)`, true)
      .addField('❯ Active Cases', formatNumber(data.active), true)
      .addField('❯ Active Critical Cases', formatNumber(data.critical), true)
      .addField('❯ Tests', formatNumber(data.tests), true)
    );
  } catch (err) {
    if (err.status === 404) return msg.say('Country not found or doesn\'t have any cases.');
    return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
  }
};
async function fetchStats(country) {
  const { body } = await request
    .get(`https://disease.sh/v3/covid-19/${country === 'all' ? 'all' : `countries/${country}`}`);
  return body;
}
  
function formatNumber(number, minimumFractionDigits = 0) {
  return Number.parseFloat(number).toLocaleString(undefined, {
    minimumFractionDigits,
    maximumFractionDigits: 2
  });
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['covid', 'corona', 'coronavirus'],
  permLevel: 0
};

exports.help = {
  name: 'covid19',
  description: 'Responds with stats for COVID-19',
  usage: 'covid19 [country]'
};

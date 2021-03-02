const request = require('node-superfetch'),
  { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    if (args.size < 1) return message.reply(`${process.env.prefix}${exports.help.usage}`);
    const country = args[0];
    const data = await fetchStats(country);
    return message.channel.send(new MessageEmbed()
      .setColor(0xA2D84E)
      .setAuthor('Worldometers', 'https://i.imgur.com/IoaBMuK.jpg', 'https://www.worldometers.info/coronavirus/')
      .setTitle(`Stats for ${country === 'all' ? 'The World' : data.country}`)
      .setURL(country === 'all'
        ? 'https://www.worldometers.info/coronavirus/'
        : `https://www.worldometers.info/coronavirus/country/${data.countryInfo.iso2}/`)
      .setThumbnail(country === 'all' ? null : data.countryInfo.flag || null)
      .setFooter('Last Updated')
      .setTimestamp(data.updated)
      .addField('❯ Total Cases', `${client.formatNumber(data.cases)} (${client.formatNumber(data.todayCases)} today)`, true)
      .addField('❯ Total Deaths', `${client.formatNumber(data.deaths)} (${client.formatNumber(data.todayDeaths)} today)`, true)
      .addField('❯ Total Recoveries',
        `${client.formatNumber(data.recove#FF0000)} (${client.formatNumber(data.todayRecove#FF0000)} today)`, true)
      .addField('❯ Active Cases', client.formatNumber(data.active), true)
      .addField('❯ Active Critical Cases', client.formatNumber(data.critical), true)
      .addField('❯ Tests', client.formatNumber(data.tests), true)
    );
  } catch (err) {
    if (err.status === 404) return message.say('Country not found or doesn\'t have any cases.');
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
async function fetchStats(country) {
  const { body } = await request
    .get(`https://disease.sh/v3/covid-19/${country === 'all' ? 'all' : `countries/${country}`}`);
  return body;
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

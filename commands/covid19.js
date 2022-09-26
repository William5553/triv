const request = require('node-superfetch');
const { formatNumber } = require('../util/Util');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    if (args.size === 0) return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
    const country = args[0];
    const data = await fetchStats(country);
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor(0xA2_D8_4E)
        .setAuthor({ name: 'Worldometers', url: 'https://www.worldometers.info/coronavirus/', iconURL: 'https://i.imgur.com/IoaBMuK.jpg' })
        .setTitle(`Stats for ${country === 'all' ? 'the World' : data.country}`)
        .setURL(country === 'all'
          ? 'https://www.worldometers.info/coronavirus/'
          : `https://www.worldometers.info/coronavirus/country/${data.countryInfo.iso2}/`)
        .setThumbnail(country === 'all' ? undefined : data.countryInfo.flag || undefined)
        .setFooter({ text: 'Last Updated' })
        .setTimestamp(data.updated)
        .addFields([
          { name: 'Total Cases', value: `${formatNumber(data.cases)} (${formatNumber(data.todayCases)} today)`, inline: true },
          { name: 'Total Deaths', value: `${formatNumber(data.deaths)} (${formatNumber(data.todayDeaths)} today)`, inline: true },
          { name: 'Total Recoveries', value: `${formatNumber(data.recovered)} (${formatNumber(data.todayRecovered)} today)`, inline: true },
          { name: 'Active Cases', value: formatNumber(data.active), inline: true },
          { name: 'Active Critical Cases', value: formatNumber(data.critical), inline: true },
          { name: 'Tests', value: formatNumber(data.tests), inline: true }
        ])
    ]});
  } catch (error) {
    if (error.status === 404) return message.reply("Country not found or doesn't have any cases.");
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor('#FF0000')
        .setTimestamp()
        .setTitle('Please report this on GitHub')
        .setURL('https://github.com/william5553/triv/issues')
        .setDescription(`**Stack Trace:**\n\`\`\`${error.stack ?? error}\`\`\``)
        .addFields({ name: '**Command:**', value: message.content })
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

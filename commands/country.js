const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { formatNumber } = require('../util/Util');

exports.run = async (client, message, args) => {
  try {
    if (args.length === 0)
      return message.reply('Tell me a country, moron');
    const query = encodeURIComponent(args.join(' '));
    const { body } = await request.get(`https://restcountries.com/v2/name/${query}`);
    const data = body[0];
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor(0x00_AE_86)
        .setTitle(data.name)
        .setThumbnail(`https://countryflagsapi.com/png/${data.alpha2Code}`)
        .addFields([
          { name: 'Top Level Domains', value: `${data.topLevelDomain?.filter(tld => tld !== '').length > 0 ? data.topLevelDomain.filter(tld => tld !== '').join(', ') : 'None'}`, inline: true },
          { name: 'Calling Codes', value: `${data.callingCodes?.length > 0 ? data.callingCodes.join(', ') : 'None'}`, inline: true },
          { name: 'Region', value: `${data.region ?? 'None'}`, inline: true },
          { name: 'Subregion', value: `${data.subregion ?? 'None'}`, inline: true },
          { name: 'Timezones', value: `${data.timezones?.length > 0 ? data.timezones.join(', ') : 'None'}`, inline: true },
          { name: 'Native Name', value: `${data.nativeName ?? 'None'}`, inline: true },
          { name: 'Demonym', value: `${data.demonym ?? 'None'}`, inline: true },
          { name: 'Area', value: `${data.area ? `${formatNumber(data.area)} km` : 'None'}`, inline: true },
          { name: 'Population', value: `${data.population ? formatNumber(data.population) : 'None'}`, inline: true },
          { name: 'Gini', value: `${data.gini ?? 'None'}`, inline: true },
          { name: 'Capital', value: `${data.capital ?? 'None'}`, inline: true },
          { name: 'Currency', value: `${data.currencies?.length > 0 ? data.currencies.map(currency => `${currency.name} - ${currency.code} (${currency.symbol})`).join('\n') : 'None'}`, inline: true },
          { name: 'Languages', value: `${data.languages?.length > 0 ? data.languages.map(lang => `${lang.name} (${lang.nativeName})`).join('\n') : 'None'}`, inline: true },
          { name: 'Borders', value: `${data.borders?.length > 0 ? data.borders.map(border => border).join(', ') : 'None'}`, inline: true },
          { name: 'Regional Blocs', value: `${data.regionalBlocs?.length > 0 ? data.regionalBlocs.map(bloc => bloc.name).join(', ') : 'None'}`, inline: true }
        ])
    ]});
  } catch (error) {
    if (error.status === 404) return message.channel.send('Could not find any results.');
    client.logger.error(error.stack ?? error);
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
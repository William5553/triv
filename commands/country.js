const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');

exports.run = async (client, msg, args) => {
  try {
    let query = args.join(' ');
    if (query.length < 1) return msg.reply('tell me a country moron');
    query = encodeURIComponent(query);
    const { body } = await request.get(`https://restcountries.eu/rest/v2/name/${query}`);
    const data = body[0];
    const embed = new MessageEmbed()
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
      .addField('❯ Languages', data.languages.map(lang => lang.name).join('/'));
    return msg.channel.send(embed);
  } catch (err) {
    if (err.status === 404) return msg.channel.send('Could not find any results.');
    return msg.reply(`an error occurred: \`${err.message}\`. Try again later!`);
  }};

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
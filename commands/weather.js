const request = require('node-superfetch');
const process = require('node:process');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  if (!process.env.openweathermap_key) return message.reply('The bot owner has not set up this command yet');
  let location = args.join(' ');
  if (!location) return message.reply('Enter a location next time, fartface');
  location = /^\d+$/.test(location) ? { type: 'zip', data: location } : { type: 'q', data: location };

  try {
    const { body } = await request
      .get('https://api.openweathermap.org/data/2.5/weather')
      .query({
        q: location.type === 'q' ? location.data : '',
        zip: location.type === 'zip' ? location.data : '',
        units: 'metric',
        appid: process.env.openweathermap_key
      });
    return message.channel.send({embeds: [new MessageEmbed()
      .setColor(0xFF_7A_09)
      .setAuthor({ name: `${body.name}, ${body.sys.country}`, iconURL: `http://openweathermap.org/img/wn/${body.weather.icon}@2x.png` })
      .setURL(`https://openweathermap.org/city/${body.id}`)
      .setTimestamp()
      .addFields([
        { name: 'Condition', value: body.weather.map(data => `${data.main} (${data.description})`).join('\n') },
        { name: 'Temperature', value: `${body.main.temp}° C`, inline: true },
        { name: 'Feels Like', value: `${body.main.feels_like}° C`, inline: true },
        { name: 'High', value: `${body.main.temp_max}° C`, inline: true },
        { name: 'Low', value: `${body.main.temp_min}° C`, inline: true },
        { name: 'Atmospheric Pressure (sea level)', value: `${body.main.sea_level} hPa`, inline: true },
        { name: 'Humidity', value: `${body.main.humidity}%`, inline: true },
        { name: 'Wind Speed', value: `${body.wind.speed} meters/sec`, inline: true },
        { name: 'Cloudiness', value: `${body.clouds.all}%`, inline: true }
      ])
    ]});
  } catch (error) {
    if (error.status === 404) return message.channel.send('Could not find any results.');
    return message.channel.send({embeds: [new MessageEmbed()
      .setColor('#FF0000')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`Stack Trace:\n\`\`\`${error.stack ?? error}\`\`\``)
      .addFields({ name: '**Command:**', value: message.content })
    ]});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  cooldown: 1000
};

exports.help = {
  name: 'weather',
  description: 'Checks the weather in the specified area.',
  usage: 'weather [place]',
  example: 'weather ohio'
};

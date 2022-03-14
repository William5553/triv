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
      .addField('Condition', body.weather.map(data => `${data.main} (${data.description})`).join('\n'))
      .addField('Temperature', `${body.main.temp}° C`, true)
      .addField('Feels Like', `${body.main.feels_like}° C`, true)
      .addField('High', `${body.main.temp_max}° C`, true)
      .addField('Low', `${body.main.temp_min}° C`, true)
      .addField('Atmospheric Pressure (sea level)', `${body.main.sea_level} hPa`, true)
      .addField('Humidity', `${body.main.humidity}%`, true)
      .addField('Wind Speed', `${body.wind.speed} meters/sec`, true)
      .addField('Cloudiness', `${body.clouds.all}%`, true)
    ]});
  } catch (error) {
    if (error.status === 404) return message.channel.send('Could not find any results.');
    return message.channel.send({embeds: [new MessageEmbed()
      .setColor('#FF0000')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`Stack Trace:\n\`\`\`${error.stack ?? error}\`\`\``)
      .addField('**Command:**', message.content)
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

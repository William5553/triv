exports.run = async (client, message, args) => {
  const request = require('node-superfetch'),
    { MessageEmbed } = require('discord.js');

  let location = args.join(' ');
  if (!location) return message.reply('enter a location next time');
  if (/^[0-9]+$/.test(location))
    location = { type: 'zip', data: location };
  else
    location = { type: 'q', data: location };

    try {
			const { body } = await request
				.get('https://api.openweathermap.org/data/2.5/weather')
				.query({
					q: location.type === 'q' ? location.data : '',
					zip: location.type === 'zip' ? location.data : '',
					units: 'metric',
					appid: client.settings.openweathermap_key
				});
			return message.channel.send(new MessageEmbed()
				.setColor(0xFF7A09)
				.setAuthor(
					`${body.name}, ${body.sys.country}`,
					`http://openweathermap.org/img/wn/${body.weather.icon}@2x.png`
				)
				.setURL(`https://openweathermap.org/city/${body.id}`)
				.setTimestamp()
				.addField('❯ Condition', body.weather.map(data => `${data.main} (${data.description})`).join('\n'))
				.addField('❯ Temperature', `${body.main.temp}° C`, true)
						    .addField('❯ Feels Like', `${body.main.feels_like}° C`, true)
						    .addField('❯ High', `${body.main.temp_max}° C`, true)
						    .addField('❯ Low', `${body.main.temp_min}° C`, true)
						    .addField('❯ Atmospheric Pressure (sea level)', `${body.main.pressure} hPa`, true)
				.addField('❯ Humidity', `${body.main.humidity}%`, true)
				.addField('❯ Wind Speed', `${body.wind.speed} meters/sec`, true)
						    .addField('❯ Cloudiness', `${body.clouds.all}%`, true)
			);
		} catch (err) {
			if (err.status === 404) return message.channel.send('Could not find any results.');
			return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'weather',
  description: 'Checks the weather in the specified area.',
  usage: 'weather [place]',
  example: 'weather ohio'
};

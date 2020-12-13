exports.run = async (client, message, args) => {
  const weather = require('weather-js'),
    { MessageEmbed } = require('discord.js');

  weather.find({ search: args.join(' '), degreeType: 'C' }, (err, result) => {
    if (err) message.channel.send(err);

    if (result.length === 0) return message.channel.send('**Please enter a valid location.**');

    var current = result[0].current,
      location = result[0].location;

    const embed = new MessageEmbed()
      .setDescription(`**${current.skytext}**`) // This is the text of what the sky looks like
      .setAuthor(`Weather for ${current.observationpoint}`) // This shows the current location of the weather.
      .setThumbnail(current.imageUrl) // This sets the thumbnail of the embed
      .setColor(0x00ae86) // This sets the color of the embed, you can set this to anything if you look put a hex color picker, just make sure you put 0x infront of the hex
      .addField('Timezone', `UTC${location.timezone}`, true) // This is the first field, it shows the timezone, and the true means `inline`, you can read more about this on the official discord.js documentation
      .addField('Degree Type', location.degreetype, true) // This is the field that shows the degree type, and is inline
      .addField('Temperature', `${current.temperature}° C`, true)
      .addField('Feels Like', `${current.feelslike}° C`, true)
      .addField('Winds', current.winddisplay, true)
      .addField('Humidity', `${current.humidity}%`, true);
    message.channel.send({ embed });
  });
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

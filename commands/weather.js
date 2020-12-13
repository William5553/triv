exports.run = async (client, message, args) => {
  const { find } = require('weather-js'),
    { MessageEmbed } = require('discord.js');

  find({ search: args.join(' '), degreeType: 'C' }, (err, result) => {
    if (err) message.channel.send(err);

    if (result.length === 0) return message.channel.send('**Please enter a valid location.**');

    const current = result[0].current,
      location = result[0].location;

    const embed = new MessageEmbed()
      .setDescription(`**${current.skytext}**`) // This is the text of what the sky looks like
      .setAuthor(`Weather for ${current.observationpoint}`) // This shows the current location of the weather.
      .setThumbnail(current.imageUrl) // This sets the thumbnail of the embed
      .setColor(0x00ae86) // This sets the color of the embed, you can set this to anything if you look put a hex color picker, just make sure you put 0x infront of the hex
      .setFooter(`Observed at ${current.observationtime}`)
      .addField('Timezone', `UTC${location.timezone}`, true) // the true means `inline`
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

exports.run = async (client, message) => {
  const color = Math.floor(Math.random() * 16777214) + 1;
  message.channel.send({
    embeds: [{
      color: color, //random color between one and 16777214 (dec)
      description: `Random color generated: ${color}\n${color} is equal to 0x${color.toString(16).toUpperCase()}`
    }]
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['rc', 'rcolor', 'color', 'colour', 'randomcolor', 'randomcolour'],
  permLevel: 0,
  cooldown: 1000
};

exports.help = {
  name: 'rcolour',
  description: 'Generates a random colour',
  usage: 'rcolour',
  example: 'rcolour'
};

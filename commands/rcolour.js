exports.run = async (client, message) => {
  const work = Math.floor(Math.random() * 16777214) + 1;
  message.channel.send({
    embed: {
      color: work, //random color between one and 16777214 (dec)
      description: `Random color generated: ${work}\n${work} is equal to 0x${work.toString(16).toUpperCase()}`,
    },
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['rc', 'rcolor', 'color', 'colour'],
  permLevel: 0,
};

exports.help = {
  name: 'rcolour',
  description: 'Generates a random colour',
  usage: 'rcolour',
};

exports.run = (client, message) => {
  const responses = [
    'Heads', 'Tails'
  ];
  message.channel.send(`${responses[Math.floor(Math.random() * responses.length)]}`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'flip',
  description: 'Flips a coin.',
  usage: 'flip'
};

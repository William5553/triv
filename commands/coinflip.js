exports.run = (client, message) => {
  const responses = [
    'it\'s heads!', 'it\'s tails!'
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

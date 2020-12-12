exports.run = (client, message) => {
  const responses = ["it's heads!", "it's tails!"];
  message.channel.send(`${responses.random()}`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['coinflip'],
  permLevel: 0
};

exports.help = {
  name: 'flip',
  description: 'Flips a coin.',
  usage: 'flip'
};

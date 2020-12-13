exports.run = async (client, message) => message.channel.send(`${["it's heads!", "it's tails!"].random()}`);


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

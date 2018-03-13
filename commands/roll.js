exports.run = (client, message) => {
  var roll = Math.floor(Math.random() * 6) + 1;
  message.reply('You rolled a ' + roll);
};



exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'roll',
  description: 'Rolls a 6-sided die.',
  usage: 'roll'
};

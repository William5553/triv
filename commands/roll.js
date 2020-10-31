exports.run = (client, message) => {
  let sides = Number(args.slice(0).join(' ')) || 6;
  var roll = Math.floor(Math.random() * sides) + 1;
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
  description: 'Rolls a die (6 sides by default).',
  usage: 'roll [dice sides]'
};

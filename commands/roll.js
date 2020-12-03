exports.run = (client, message, args) => {
  const sides = Number(args.slice(0).join(' ')) || 6;
  var roll = Math.floor(Math.random() * sides) + 1;
  message.reply('You rolled ' + roll);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
};

exports.help = {
  name: 'roll',
  description: 'Rolls a die',
  usage: 'roll [dice sides]',
};

exports.run = (client, message, args) => {
  const sides = Number(args.join(' ')) || 6;
  message.reply(`you rolled a ${Math.floor(Math.random() * sides) + 1}`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  cooldown: 1000
};

exports.help = {
  name: 'roll',
  description: 'Rolls a die',
  usage: 'roll [dice sides]',
  example: 'roll 6'
};

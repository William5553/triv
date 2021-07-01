exports.run = (client, message, args) => {
  message.reply(`You rolled a ${Math.floor(Math.random() * (Number(args.join(' ')) || 6)) + 1}`);
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

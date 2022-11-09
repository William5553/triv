const addBinary = array => {
  let sum = 0;
  for (const element of array)
    sum += Number.parseInt(element, 2);
  return sum.toString(2);
};

exports.run = (client, message, args) => {
  if (args.length < 2) return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
  return message.reply(addBinary(args));
};
  
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['badd', 'addbinary'],
  permLevel: 0,
  cooldown: 0
};
  
exports.help = {
  name: 'binaryadd',
  description: 'Adds binary numbers',
  usage: 'binaryadd [binary] [binary]',
  example: 'binaryadd 10011101 10110110'
};
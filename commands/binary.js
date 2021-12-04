exports.run = (client, message, args) => {
  if (args.length < 2) return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
  if (args[0] === 'decode') {
    if (args[1] === 'decimal') {
      const final = [];
      for (const binary of args.slice(2))
        final.push(Number.parseInt(binary, 2));
      message.channel.send(final.join(' '));
    } else if (args[1] === 'text') {
      message.channel.send(args.slice(2).map(elem => {
        return String.fromCodePoint(Number.parseInt(elem, 2));
      })
        .join('')
      );
    } else
      return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
  } else if (args[0] === 'encode') {
    if (args[1] === 'decimal') {
      const final = [];
      for (const dec of args.slice(2))
        final.push((dec >>> 0).toString(2));
      message.channel.send(final.join(' '));
    } else if (args[1] === 'text') {
      message.channel.send(args.slice(2).join(' ').split('').map(char => {
        return char.codePointAt(0).toString(2);
      }).join(' ')
      );
    } else
      return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
  } else
    return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  cooldown: 500
};

exports.help = {
  name: 'binary',
  description: 'Encodes and decodes binary',
  usage: 'binary [decode|encode] [text|decimal] [text]',
  example: 'binary encode text triv'
};

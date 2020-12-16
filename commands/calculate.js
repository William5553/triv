const { Parser } = require('expr-eval');

exports.run = async (client, message, args) => {
  try {
    const evaluated = Parser.evaluate(args.join(' ')).toString();
    return message.channel.send(evaluated).catch(() => message.channel.send('Invalid expression'));
  } catch {
    return message.channel.send('Invalid expression');
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['calc', 'solve'],
  permLevel: 0
};

exports.help = {
  name: 'calculate',
  description: 'Solves a math question',
  usage: 'calculate [expression]'
};

const { clean } = require('../util/Util');

exports.run = async (client, message, args) => {
  if (args.length < 1) return message.reply('Tell me what to run, moron');
  try {
    let evaled = eval(args.join(' '));
    if (evaled && evaled.constructor.name == 'Promise')
      evaled = await evaled;
    if (typeof evaled !== 'string')
      evaled = require('util').inspect(evaled), { depth: client.evalDepth };
    evaled = await clean(evaled);
    if (evaled.length > 1980)
      evaled = evaled.substr(0, 1980) + '...';
    message.channel.send({ content: evaled, code: 'xl' });
  } catch (err) {
    let result = await clean(err);
    if (result.length > 1980)
      result = result.substr(0, 1980) + '...';
    message.channel.send({ content: `ERROR: ${result}`, code: 'xl' });
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 10
};

exports.help = {
  name: 'eval',
  description: 'Evaluates arbitrary JavaScript',
  usage: 'eval [code]',
  example: "eval message.channel.send('turtle');"
};

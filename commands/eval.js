exports.run = async (client, message, args) => {
  const code = args.join(' ');
  if (code.length < 1) return message.reply('tell me what to run moron');
  try {
    var evaled = eval(code);
    if (evaled && evaled.constructor.name == 'Promise') evaled = await evaled;
    if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
    evaled = await client.clean(evaled);
    if (evaled.length > 1980) evaled = evaled.substr(0, 1980) + '...';
    message.channel.send(evaled, { code: 'xl' });
  } catch (err) {
    if (typeof err !== 'string') return;
    let result = await client.clean(err);
    if (result.length > 1980) result = result.substr(0, 1980) + '...';
    message.channel.send(`ERROR: ${result}`, {code: 'xl'});
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
  description: 'Evaluates arbitrary javascript',
  usage: 'eval [code]'
};

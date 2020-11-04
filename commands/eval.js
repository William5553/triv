exports.run = async (client, message, args) => {
  const settings = require('../settings.json');
  var code = args.join(' ');
  if (code.length < 1) return message.reply('tell me what to run moron');
  try {
    var evaled = eval(code);
    if (evaled && evaled.constructor.name == 'Promise')
      evaled = await evaled;
    if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
    message.channel.send(`\`\`\`xl\n${client.clean(client, evaled)}\n\`\`\``
    );
  }
  catch (err) {
    message.channel.send(`\`ERROR\` \`\`\`xl\n${client.clean(client, err)}\n\`\`\``);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 4
};


exports.help = {
  name: 'eval',
  description: 'Evaluates arbitrary javascript.',
  usage: 'eval [code]'
};

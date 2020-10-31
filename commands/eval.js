exports.run = async (client, message, args) => {
  const settings = require('../settings.json');
  if (message.author.id !== settings.ownerid) return message.reply('no');
  var code = args.join(' ');
  if (code.length < 1) return message.reply('Please input code, master.');
  try {
    var evaled = eval(code);
    if (evaled && evaled.constructor.name == 'Promise')
      evaled = await evaled;
    if (typeof evaled !== 'string')
      evaled = require('util').inspect(evaled);
    message.channel.send(`\`\`\`xl\n${clean(client, evaled)}\n\`\`\``
    );
  }
  catch (err) {
    message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(client, err)}\n\`\`\``);
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


function clean(client, text) {
  if (typeof(text) === 'string') {
    return text.replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203))
      .replace(client.token, 'CENSORED');
  }
  else {
    return text;
  }
}

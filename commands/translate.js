const settings = require('../settings.json');
const translate = require('translate-google-api');

exports.run = (client, message, args) => {
  if (args.length < 3)
    return message.reply(`Wrong format: An example would be \`${settings.prefix}translate en fr english-text-here\` which would translate \`english-text-here\` into french`);
  const text = args.slice(2).join(' ');

  const t = await translate(text, { from: args[0], to: args[1] }).catch(err => {
    if (err) return message.channel.send(err);
  });
  if (t) message.channel.send(t);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'translate',
  description: 'Translates text',
  usage: 'translate [language from] [language to] [text]'
};

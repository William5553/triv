const translate = require('@william5553/translate-google-api');
const { clean, getCode } = require('../util/Util');

exports.run = async (client, message, args) => {
  if (args.length < 3) return message.reply(`Wrong format: An example would be \`${client.getPrefix(message)}${exports.help.name} en fr english text here\` which would translate \`english text here\` into french`);
  const text = args.slice(2).join(' ');

  const a1 = getCode(args[0].toProperCase());
  const a2 = getCode(args[1].toProperCase());

  if (!getCode(a1)) return message.reply(`${args[0]} isn't a supported language`);
  if (!getCode(a2)) return message.reply(`${args[1]} isn't a supported language`);

  let t = await translate(text, { from: a1, to: a2 }).catch(error => message.reply(error.toString()));
  t = await clean(t[0]);
  if (t) message.reply(t);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['googletranslate', 'gt', 'tr'],
  permLevel: 0,
  cooldown: 2500
};

exports.help = {
  name: 'translate',
  description: 'Translates text using Google Translate',
  usage: 'translate [language from] [language to] [text]',
  example: 'translate en french I like waffles'
};

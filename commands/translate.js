const translate = require('translate-google-api'),
  langs = require('../assets/languages.json'),
  { clean } = require('../util/Util');

exports.run = async (client, message, args) => {
  if (args.length < 3)
    return message.reply(
      `Wrong format: An example would be \`${process.env.prefix}${exports.help.name} en fr english-text-here\` which would translate \`english-text-here\` into french`
    );
  const text = args.slice(2).join(' ');

  const a1 = getCode(args[0].toProperCase());
  const a2 = getCode(args[1].toProperCase());

  if (!isSupport(a1)) return message.reply(`${args[0]} isn't a supported language`);
  if (!isSupport(a2)) return message.reply(`${args[1]} isn't a supported language`);

  let t = await translate(text, { from: a1, to: a2 }).catch(err => message.reply(err.toString()));
  t = await clean(t[0]);
  if (t) message.channel.send(t).catch(client.logger.error);
};

function isSupport(language) {
  return Boolean(getCode(language));
}

function getCode(language) {
  if (!language) {
    return false;
  }
  if (langs[language]) {
    return langs[language];
  }
  var keys = Object.keys(langs).filter(function(item) {
    var lowerLan = language.toLowerCase();
    return langs[item] === lowerLan;
  });
  if (keys[0]) {
    return langs[keys[0]];
  }
  return false;
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['googletranslate', 'gt', 'tr'],
  permLevel: 0
};

exports.help = {
  name: 'translate',
  description: 'Translates text using Google Translate',
  usage: 'translate [language from] [language to] [text]',
  example: 'translate en french i like waffles'
};

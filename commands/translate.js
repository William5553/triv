const settings = require('../settings.json'),
  translate = require('translate-google-api');

exports.run = async (client, message, args) => {
  if (args.length < 3)
    return message.reply(
      `Wrong format: An example would be \`${settings.prefix}translate en fr english-text-here\` which would translate \`english-text-here\` into french`
    );
  const text = args.slice(2).join(' ');

  const a1 = getCode(args[0].toProperCase());
  const a2 = getCode(args[1].toProperCase());

  if (!isSupport(a1)) return message.reply(`${args[0]} isn't a language`);
  if (!isSupport(a2)) return message.reply(`${args[1]} isn't a language`);

  let t = await translate(text, { from: a1, to: a2 }).catch(err => {
    return err.toString();
  });
  t = await client.clean(t);
  if (t) message.channel.send(t).catch(client.logger.error);
};

const langs = {
  Automatic: 'auto',
  Afrikaans: 'af',
  Albanian: 'sq',
  Amharic: 'am',
  Arabic: 'ar',
  Armenian: 'hy',
  Azerbaijani: 'az',
  Basque: 'eu',
  Belarusian: 'be',
  Bengali: 'bn',
  Bosnian: 'bs',
  Bulgarian: 'bg',
  Catalan: 'ca',
  Cebuano: 'ceb',
  Chichewa: 'ny',
  Chinesesimp: 'zh-cn',
  Chinese: 'zh-tw',
  Corsican: 'co',
  Croatian: 'hr',
  Czech: 'cs',
  Danish: 'da',
  Dutch: 'nl',
  English: 'en',
  Esperanto: 'eo',
  Estonian: 'et',
  Filipino: 'tl',
  Finnish: 'fi',
  French: 'fr',
  Frisian: 'fy',
  Galician: 'gl',
  Georgian: 'ka',
  German: 'de',
  Greek: 'el',
  Gujarati: 'gu',
  Haitian: 'ht',
  Haitiancreole: 'ht',
  Creole: 'ht',
  Hausa: 'ha',
  Hawaiian: 'haw',
  Hebrew: 'iw',
  Hindi: 'hi',
  Hmong: 'hmn',
  Hungarian: 'hu',
  Icelandic: 'is',
  Igbo: 'ig',
  Indonesian: 'id',
  Irish: 'ga',
  Italian: 'it',
  Japanese: 'ja',
  Javanese: 'jw',
  Kannada: 'kn',
  Kazakh: 'kk',
  Khmer: 'km',
  Korean: 'ko',
  Kurdish: 'ku',
  Kyrgyz: 'ky',
  Lao: 'lo',
  Latin: 'la',
  Latvian: 'lv',
  Lithuanian: 'lt',
  Luxembourgish: 'lb',
  Macedonian: 'mk',
  Malagasy: 'mg',
  Malay: 'ms',
  Malayalam: 'ml',
  Maltese: 'mt',
  Maori: 'mi',
  Marathi: 'mr',
  Mongolian: 'mn',
  Myanmar: 'my',
  Nepali: 'ne',
  Norwegian: 'no',
  Pashto: 'ps',
  Persian: 'fa',
  Polish: 'pl',
  Portuguese: 'pt',
  Punjabi: 'ma',
  Romanian: 'ro',
  Russian: 'ru',
  Samoan: 'sm',
  Scotsgaelic: 'gd',
  Serbian: 'sr',
  Sesotho: 'st',
  Shona: 'sn',
  Sindhi: 'sd',
  Sinhala: 'si',
  Slovak: 'sk',
  Slovenian: 'sl',
  Somali: 'so',
  Spanish: 'es',
  Sundanese: 'su',
  Swahili: 'sw',
  Swedish: 'sv',
  Tajik: 'tg',
  Tamil: 'ta',
  Telugu: 'te',
  Thai: 'th',
  Turkish: 'tr',
  Ukrainian: 'uk',
  Urdu: 'ur',
  Uyghur: 'ug',
  Uzbek: 'uz',
  Vietnamese: 'vi',
  Welsh: 'cy',
  Xhosa: 'xh',
  Yiddish: 'yi',
  Yoruba: 'yo',
  Zulu: 'zu'
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
  aliases: ['gt'],
  permLevel: 0
};

exports.help = {
  name: 'translate',
  description: 'Translates text using Google Translate',
  usage: 'translate [language from] [language to] [text]',
  example: 'translate en french i like waffles'
};

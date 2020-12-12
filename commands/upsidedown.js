const esrever = require('esrever'),
  replaceD = {
    y: 'ʎ',
    w: 'ʍ',
    v: 'ʌ',
    u: 'n',
    t: 'ʇ',
    r: 'ɹ',
    q: 'b',
    p: 'd',
    n: 'u',
    m: 'ɯ',
    l: 'ן',
    k: 'ʞ',
    j: 'ɾ',
    i: 'ᴉ',
    h: 'ɥ',
    g: 'ƃ',
    f: 'ɟ',
    e: 'ǝ',
    d: 'p',
    c: 'ɔ',
    b: 'q',
    a: 'ɐ',
    '!': '¡',
    '?': '¿',
    '&': '⅋',
    ',': "'",
    "'": ',',
    '"': ',,',
    '.': '˙',
    '9': '6',
    '7': 'ㄥ',
    '6': '9',
    '5': 'ϛ',
    '4': 'ㄣ',
    '3': 'Ɛ',
    '2': 'ᄅ',
    '1': 'Ɩ',
    _: '‾'
  };
exports.run = (client, message, args) => {
  const frick = args.join(' ').replace(/[a-z0-9&_.,!"?']/gi, match => {
    return typeof replaceD[match] != 'undefined' ? replaceD[match] : match;
  });
  message.channel.send(esrever.reverse(frick));
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['fliptext', 'upsidedownify'],
  permLevel: 0
};

exports.help = {
  name: 'upsidedown',
  description: 'Flips text upside down',
  usage: 'upsidedown [text]'
};

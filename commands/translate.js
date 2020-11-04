const language = require('../util/langOptions');
const translate = require('google-translate-api');

exports.run = (client, message, args) => {
  if (args.length < 3) {
    message.reply(
      'Wrong format: An example would be `!translate swedish korean swedish-text-here` where after `!translate` would translate the `swedish-text-here` into korean'
    );
  } else {
    const argFrom = args[0].toLowerCase();
    const argTo = args[1].toLowerCase();
    /*
    let lang_from = language.filter(ele => ele.name === argFrom)[0].abrv;
    let lang_to = language.filter(ele => ele.name === argTo)[0].abrv;
    */
    const text = args.slice(2).join(' ');

    translate(text, { from: argFrom, to: argTo })
      .then(res => message.channel.send(res.text))
      .catch(err => message.channel.send(err));
  }
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

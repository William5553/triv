const language = require('./langOptions');
const translate = require('google-translate-api');

exports.run = (client, message, args) => {
if (args.length < 3) {
            message.reply("Wrong format: An example would be `!translate swedish korean swedish-text-here` where after `!translate` would translate the `swedish-text-here` into korean");
        } else {
            let argFrom = args[0].toLowerCase();
            let argTo = args[1].toLowerCase();

            let lang_from = language.filter(ele => ele.name === argFrom)[0].abrv;
            let lang_to = language.filter(ele => ele.name=== argTo)[0].abrv;
            let text = args.slice(2).join(' ');

            translate(text, {from: lang_from, to: lang_to})
                .then(res => message.channel.send(res.text))
                .catch(err => console.log(`Error: ${err}`));
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

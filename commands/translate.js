let translate, isSupported;

(async () => {
  ({ translate, isSupported } = await import('@william5553/translate-google-api'));
})();

const { MessageEmbed } = require('discord.js');
const { clean } = require('../util/Util');

exports.run = async (client, message, args) => {
  try {
    if (args.length < 3) return message.reply(`Wrong format: An example would be \`${client.getPrefix(message)}${exports.help.name} en fr english text here\` which would translate \`english text here\` into french`);
    const text = args.slice(2).join(' ');

    if (!isSupported(args[0])) return message.reply(`${args[0]} isn't a supported language`);
    if (!isSupported(args[1])) return message.reply(`${args[1]} isn't a supported language`);

    translate(text, { from: args[0], to: args[1] })
      .then(res => res.text)
      .then(clean)
      .then(cleaned => message.reply(cleaned));
  } catch (error) {
    client.logger.error(error.stack ?? error);
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor('#FF0000')
        .setTimestamp()
        .setTitle('Please report this on GitHub')
        .setURL('https://github.com/william5553/triv/issues')
        .setDescription(`**Stack Trace:**\n\`\`\`${error.stack ?? error}\`\`\``)
        .addFields({ name: '**Command:**', value: message.content })
    ]});
  }
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

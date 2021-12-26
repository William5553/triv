const fetch = require('node-superfetch');
const { MessageEmbed } = require('discord.js');
const EscapeMarkdown = (text) => text.replace(/(\*|~+|`)/g, '');

exports.run = async (client, message, args) => {
  try {
    const { body } = await fetch
      .post('https://hastebin.com/documents')
      .send(EscapeMarkdown(args.join(' ')));

    message.channel.send({embeds: [
      new MessageEmbed()
        .setTitle('Hastebin')
        .setColor('BLURPLE')
        .setDescription(`https://hastebin.com/${body.key}`)
    ]});
  } catch (error) {
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor('#FF0000')
        .setTimestamp()
        .setTitle('Please report this on GitHub')
        .setURL('https://github.com/william5553/triv/issues')
        .setDescription(`**Stack Trace:**\n\`\`\`${error.stack ?? error}\`\`\``)
        .addField('**Command:**', message.content)
    ]});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['hb'],
  permLevel: 0,
  cooldown: 5000
};

exports.help = {
  name: 'hastebin',
  description: 'Upload text to hastebin',
  usage: 'hastebin [text]'
};

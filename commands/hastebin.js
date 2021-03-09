const fetch = require('node-superfetch');
const { MessageEmbed } = require('discord.js');
const EscapeMarkdown = (text) => text.replace(/(\*|~+|`)/g, '');

exports.run = async (client, message, args) => {
  const { body } = await fetch
    .post('https://hastebin.com/documents')
    .send(EscapeMarkdown(args.join(' ')));

  message.channel.send(new MessageEmbed()
    .setTitle('Hastebin')
    .setColor('BLURPLE')
    .setDescription(`https://hastebin.com/${body.key}`));
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

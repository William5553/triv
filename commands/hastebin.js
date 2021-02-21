const fetch = require('node-superfetch'),
  { MessageEmbed } = require('discord.js'),
  EscapeMarkdown = (text) => text.replace(/(\*|~+|`)/g, ''),
  baseURL = 'https://hastebin.com';

exports.run = async (client, message, args) => {
  const { body } = await fetch
    .post(`${baseURL}/documents`)
    .send(EscapeMarkdown(args.join(' ')));

  message.channel.send(new MessageEmbed()
    .setTitle('Hastebin')
    .setColor('BLURPLE')
    .setDescription(`${baseURL}/${body.key}`));
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

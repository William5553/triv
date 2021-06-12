const { MessageEmbed } = require('discord.js');

exports.run = (client, message, args) => {
  if (args.join(' ').length < 1) return message.reply("we don't accept blank feedback!");
  message.channel.send({embeds: [new MessageEmbed()
    .setColor(0x00ae86)
    .setDescription('Found a bug? Report it [here](https://github.com/William5553/triv/issues)')
    .setTitle('Feedback sent.. :envelope:')
  ]});
  return client.channels.cache.get(process.env.feedback_channel_id).send({embeds: [new MessageEmbed()
    .setColor(0x00ae86)
    .setTimestamp()
    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
    .setFooter(`User ID: ${message.author.id}`)
    .setDescription(args.join(' '))
  ]});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  cooldown: 600000
};

exports.help = {
  name: 'feedback',
  description: 'Send feedback about the bot',
  usage: 'feedback [feedback]',
  example: 'feedback this bot sucks'
};

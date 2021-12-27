const { MessageEmbed } = require('discord.js');

exports.run = (client, message, args) => {
  if (args.length === 0) return message.reply("We don't accept blank feedback!");
  message.channel.send({embeds: [
    new MessageEmbed()
      .setColor(0x00_AE_86)
      .setDescription('Found a bug? Report it [here](https://github.com/William5553/triv/issues)')
      .setTitle('Feedback sent.. :envelope:')
  ]});
  return client.channels.cache.resolve(process.env.feedback_channel_id).send({embeds: [
    new MessageEmbed()
      .setColor(0x00_AE_86)
      .setTimestamp()
      .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setFooter(`User ID: ${message.author.id}`)
      .setDescription(args.join(' '))
  ]});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  cooldown: 600_000
};

exports.help = {
  name: 'feedback',
  description: 'Send feedback about the bot',
  usage: 'feedback [feedback]',
  example: 'feedback this bot sucks'
};

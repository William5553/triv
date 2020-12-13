const settings = require('../settings.json'),
  { MessageEmbed } = require('discord.js');

exports.run = (client, message, args) => {
  const feedback = args.join(' ');
  if (feedback.length < 1) return message.reply("we don't accept blank feedback!").catch(client.logger.error);
  message.channel.send(new MessageEmbed.setColor(0x00ae86)
    .setDescription('Found a bug? Report it [here](https://github.com/William5553/discord-bot/issues)')
    .setTitle('Feedback sent.. :envelope:')
  );
  return client.channels.cache.get(settings.feedback_channel_id).send(new MessageEmbed()
    .setColor(0x00ae86)
    .setTimestamp()
    .setDescription(
      `**Sent in by:** ${message.author.tag}\n\n**ID: ** ${message.author.id}\n\n**Feedback:** ` + feedback
    )
  ).catch(client.logger.error);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'feedback',
  description: 'Sends feedback, if you abuse this you will be blacklisted.',
  usage: 'feedback [feedback]',
  example: 'feedback this bot sucks'
};

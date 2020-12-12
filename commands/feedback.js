const { MessageEmbed } = require('discord.js'),
  feedbackid = '340924459026219009';
exports.run = (client, message, args) => {
  const feedback = args.slice(0).join(' ');
  if (feedback.length < 1) return message.reply("we don't accept blank feedback!").catch(client.logger.error);
  const respo = new MessageEmbed.setColor(0x00ae86)
    .setDescription('Found a bug? Report it at https://github.com/William5553/discord-bot/issues')
    .setTitle('Feedback sent.. :envelope:');
  message.channel.send(respo);
  const embed = new MessageEmbed()
    .setColor(0x00ae86)
    .setTimestamp()
    .setDescription(
      `**Sent in by:** ${message.author.tag}\n\n**ID: ** ${message.author.id}\n\n**Feedback:** ` + feedback
    );
  return client.channels.cache.get(feedbackid).send({ embed }).catch(client.logger.error);
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

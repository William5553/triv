const Discord = require('discord.js');
exports.run = (client, message, args) => {
  const reason = args.slice(1).join(' ');
  const user = message.mentions.users.first();
  const modlog = client.channels.find('name', 'bot-logs');
  if (!modlog) return message.reply('I cannot find a bot-logs channel');
  if (reason.length < 1) return message.reply('You must supply a reason for the warning.');
  if (message.mentions.users.size < 1) return message.reply('You must mention someone to warn them.').catch(console.error);
  const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .setDescription(`**Action:** Warning\n**Target:** ${user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}\n**User ID:** ${user.tag}`);
  return client.channels.get(modlog.id).send({embed});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: 'warn',
  description: 'Issues a warning to the mentioned user.',
  usage: 'warn [mention] [reason]'
};

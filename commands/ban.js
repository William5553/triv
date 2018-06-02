const {RichEmbed} = require('discord.js');
const {caseNumber} = require('../util/caseNumber.js');
const {parseUser} = require('../util/parseUser.js');
const settings = require('../settings.json');
exports.run = async (client, message, args) => {
  const user = message.mentions.users.first();
  const botlog = client.channels.find('name','bot-logs');
  if (user.id === settings.ownerid) {
    return message.channel.send('You, ' + message.author + ' shall not ban my master!');
  }
  if (user.id === settings.bot_client_id) {
    return message.channel.send('No! Don\'t ban me!');
  }
  parseUser(message, user);
  const caseNum = await caseNumber(client, botlog);
  if (!botlog) return message.reply('I cannot find a channel named bot-logs');
  if (message.mentions.users.size < 1) return message.reply('You must mention someone to ban them.').catch(console.error);
  message.guild.ban(user, 2);
  var chnl = message.Channel ;
  var gank = chnl.Guild.Name;
  message.user.send('Seems like you have been banned from ' + gank);
  const reason = args.splice(1, args.length).join(' ') || `Awaiting moderator's input. Use ${settings.prefix}reason ${caseNum} <reason>.`;
  const embed = new RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .setDescription(`**Action:** Ban\n**Target:** ${user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}\n**User ID:** ${user.id}`)
    .setFooter(`ID ${caseNum}`);
  return botlog.id.send({embed});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: 'ban',
  description: 'Bans the mentioned user.',
  usage: 'ban [mention] [reason]'
};

const {MessageEmbed} = require('discord.js');
const {caseNumber} = require('../util/caseNumber.js');
const {parseUser} = require('../util/parseUser.js');
const settings = require('../settings.json');
exports.run = async (client, message, args) => {
  if (!message.member.permissions.has("BAN_MEMBERS")) return message.reply('you don\'t have the permission **BAN MEMBERS**');
  const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if (user.permissions.has("BAN_MEMBERS")) return message.reply('the person you tried to ban is too op (they also have the ban members permission)');
  const botlog = message.guild.channels.find(
      channel => channel.name === 'bot-logs'
    );
  if (user.id == settings.ownerid) {
    return message.reply('no!');
  }
  if (user.id == settings.bot_client_id) {
    return message.channel.send('No! Don\'t ban me!');
  }
  parseUser(message, user);
  const caseNum = await caseNumber(client, botlog);
  if (!botlog) return message.reply('I cannot find a channel named bot-logs');
  if (message.mentions.users.size < 1) return message.reply('You must mention someone to ban them.').catch(console.error);
  var chnl = message.Channel ;
  var gank = chnl.Guild.Name;
  message.user.send('Seems like you have been banned from ' + gank);
  const reason = args.splice(1, args.length).join(' ') || `Awaiting moderator's input. Use ${settings.prefix}reason ${caseNum} <reason>.`;
  message.guild.members.ban(user, {days: 0, reason: reason});
  const embed = new MessageEmbed()
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

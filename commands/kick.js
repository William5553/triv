const {MessageEmbed} = require('discord.js');
const {caseNumber} = require('../util/caseNumber.js');
const {parseUser} = require('../util/parseUser.js');
const settings = require('../settings.json');
exports.run = async (client, message, args) => {
  const userr = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if (!userr) return message.reply('tag someone to kick next time before I kick you');
  parseUser(message, userr.user);
  if (userr.user.id == client.user.id) {
    return message.channel.send('You cannot, fool!');
  }
  if (userr.user.id == settings.ownerid) {
    return message.reply('not willeh!');
  }
  const botlog = message.guild.channels.cache.find(
      channel => channel.name === 'bot-logs'
    );
  const caseNum = await caseNumber(client, botlog);
  if (!botlog) return message.channel.send('I cannot find a channel named bot-logs');
  userr.kick().catch(console.error);
  userr.user.send(`Seems like you have been kicked from ${message.channel.guild.name`).catch(console.error);
  const reason = args.splice(1, args.length).join(' ') || `Awaiting moderator's input. Use ${settings.prefix}reason ${caseNum} <reason>.`;
  const embed = new MessageEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .setDescription(`**Action:** Kick\n**Target:** ${userr.user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}\n**User ID:** ${userr.user.id}`)
    .setFooter(`ID ${caseNum}`);
  return botlog.send({embed}).catch(console.error);
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: 'kick',
  description: 'Kicks the mentioned user.',
  usage: 'kick [mention] [reason]'
};

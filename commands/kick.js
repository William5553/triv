const {RichEmbed} = require('discord.js');
const {caseNumber} = require('../util/caseNumber.js');
const {parseUser} = require('../util/parseUser.js');
const settings = require('../settings.json');
exports.run = async (client, message, args) => {
  const user = message.mentions.users.first();
  parseUser(message, user);
  if (user.id == settings.bot_client_id) {
    return message.channel.send('You cannot, fool!');
  }
  if (user.id == settings.ownerid) {
    return message.channel.send('Not willeh!');
  }
  const botlog = message.guild.channels.find(
      channel => channel.name === 'bot-logs'
    );
  const caseNum = await caseNumber(client, botlog);
  if (!botlog) return message.channel.send('I cannot find a channel named bot-logs');
  if (message.mentions.users.size < 1) return message.channel.send('You must mention someone to kick them.').catch(console.error);
  message.guild.member(user).kick();
  var chnl = message.Channel ;
  var gank = chnl.Guild.Name;
  message.user.send('Seems like you have been kicked from ' + gank);
  const reason = args.splice(1, args.length).join(' ') || `Awaiting moderator's input. Use ${settings.prefix}reason ${caseNum} <reason>.`;
  const embed = new RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .setDescription(`**Action:** Kick\n**Target:** ${user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}\n**User ID:** ${user.id}`)
    .setFooter(`ID ${caseNum}`);
  return client.channels.get(botlog.id).send({embed});
};

exports.conf = {
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: 'kick',
  description: 'Kicks the mentioned user.',
  usage: 'kick [mention] [reason]'
};

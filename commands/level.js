const Discord = require('discord.js');
const xp = require('../xp.json');

module.exports.run = async (client, message) => {

  if (!xp[message.author.id]) {
    xp[message.author.id] = {
      xp: 0,
      level: 1
    };
  }
  const curxp = xp[message.author.id].xp;
  const curlvl = xp[message.author.id].level;
  const msgsent = xp[message.author.id].messagessent;
  const nxtLvlXp = curlvl * 200;
  const difference = nxtLvlXp - curxp;

  const lvlEmbed = new Discord.MessageEmbed()
    .setAuthor(message.author.username)
    .setColor(0x902B93)
    .addField('Level', curlvl, true)
    .addField('XP', curxp, true)
    .addField('Messages Sent', msgsent, true)
    .setFooter(`${difference} XP til level up`, message.author.displayAvatarURL());

  message.channel.send(lvlEmbed);

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'level',
  description: 'Shows your current level',
  usage: 'level'
};

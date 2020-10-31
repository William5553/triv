const Discord = require('discord.js');
const xp = require('../storage/xp.json');

module.exports.run = async (client, message) => {

  if (!xp[message.author.id]) {
    xp[message.author.id] = {
      xp: 0,
      level: 1
    };
  }
  const curxp = xp[message.author.id].xp;
  const curlvl = xp[message.author.id].level;
  const nxtLvlXp = curlvl * 250;
  const difference = nxtLvlXp - curxp;

  const lvlEmbed = new Discord.RichEmbed()
    .setAuthor(message.author.username)
    .setColor(0x902B93)
    .addField('Level', curlvl, true)
    .addField('XP', curxp, true)
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

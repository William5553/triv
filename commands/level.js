const { MessageEmbed } = require('discord.js');
const xp = require('../xp.json');

exports.run = async (client, message, args) => {

  const user = message.mentions.users.first() || message.author;
  
  if (user.bot) return message.reply('that\'s a bot');
  
  if (!xp[user.id]) {
    xp[user.id] = {
      xp: 0,
      level: 1,
      messagessent: 0
    };
  }
  const curxp = xp[user.id].xp;
  const curlvl = xp[user.id].level;
  const msgsent = xp[user.id].messagessent;
  const nxtLvlXp = curlvl * 200;
  const difference = nxtLvlXp - curxp;

  const lvlEmbed = new MessageEmbed()
    .setAuthor(user.username, user.displayAvatarURL())
    .setColor(0x902B93)
    .addField('Level', curlvl, true)
    .addField('XP', curxp, true)
    .addField('Messages Sent', msgsent, true)
    .setFooter(`${difference} XP til level up`);

  message.channel.send(lvlEmbed);

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['lvl'],
  permLevel: 0
};

exports.help = {
  name: 'level',
  description: 'Shows your current level',
  usage: 'level'
};

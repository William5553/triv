const { MessageEmbed } = require('discord.js');
const xp = require('../xp.json');

exports.run = async (client, message) => {
  const user = message.mentions.users.first() || message.author;

  if (user.bot) return message.reply("that's a bot");

  if (!xp[message.guild.id]) {
      xp[message.guild.id] = {};
    };
  }
  if (!xp[message.guild.id][user.id]) {
    xp[message.guild.id][user.id] = {
      lvl: 1,
      xp: 0,
      ms: 0
    };
  }

const curxp = xp[message.guild.id][user.id].xp;
   const curlvl = xp[message.guild.id][user.id].lvl;
   const msgsent = xp[message.guild.id][user.id].ms;
   const nxtLvlXp = curlvl * 200;
   const difference = nxtLvlXp - curxp;

  const lvlEmbed = new MessageEmbed()
    .setAuthor(`${user.username} - ${message.guild.name}`, user.displayAvatarURL())
    .setColor(0x902b93)
    .addField('Level', curlvl, true)
    .addField('XP', curxp, true)
    .addField('Messages Sent', msgsent, true)
    .setFooter(`${difference} XP 'til level up`);

  message.channel.send(lvlEmbed);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['lvl', 'xp'],
  permLevel: 0
};

exports.help = {
  name: 'level',
  description: 'Shows your current level',
  usage: 'level'
};

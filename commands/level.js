const { MessageEmbed } = require('discord.js');
const xp = require('../xp.json');

exports.run = async (client, message) => {
  const user = message.mentions.users.first() || message.author;

  if (user.bot) return message.reply("that's a bot");

  if (!xp[message.guild.id]) {
    xp[message.guild.id] = {
      '-1': {
        lvl: 1,
        xp: 0,
        ms: 0
      },
    };
  }
  if (!xp[message.guild.id][user.id]) {
    xp[message.guild.id][user.id] = {
      lvl: 1,
      xp: 0,
      ms: 0
    };
  }

  const uxp = xp[message.guild.id][user.id];

  const lvlEmbed = new MessageEmbed()
    .setAuthor(`${user.username} - ${message.guild.name}`, user.displayAvatarURL())
    .setColor(0x902b93)
    .addField('Level', uxp.lvl, true)
    .addField('XP', uxp.xp, true)
    .addField('Messages Sent', uxp.ms, true)
    .setFooter(`${uxp.lvl*200 - uxp.xp} XP 'til level up`);

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

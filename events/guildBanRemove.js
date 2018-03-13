const Discord = require('discord.js');

module.exports = (guild, user) => {
  const message = require('./message.js');
  message.channel.send(`${user.tag} just got unbanned!`);
  const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .setDescription(`**Action:** Unban\n**Target:** ${user.tag}\n**Moderator:** ${guild.client.unbanAuth.tag}\n**Reason:** ${guild.client.unbanReason}`);
  return guild.channels.get(guild.channels.find('name', 'bot-logs').id).send({embed});

};

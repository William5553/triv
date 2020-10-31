const { MessageEmbed } = require('discord.js');
module.exports = (guild, user) => {
  const message = require('./message.js');
  message.channel.send(`${user.tag} just got unbanned!`);
  const embed = new MessageEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .setDescription(`**Action:** Unban\n**Target:** ${user.tag}\n**Moderator:** ${guild.client.unbanAuth.tag}\n**Reason:** ${guild.client.unbanReason}`);
  return guild.channels.cache.find(channel => channel.name === 'bot-logs').id.send({embed});
};

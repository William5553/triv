const Discord = require('discord.js');
module.exports = message => {
if (message.channel.type === 'text') {
    const botlog = message.guild.channels.cache.find(
      channel => channel.name === 'bot-logs'
    );
    if (botlog) {
      const msgDel = new Discord.MessageEmbed()
        .setTitle('Message Deleted')
        .addField('Author', message.author.username)
        .addField('Message', message)
        .setThumbnail(message.author.avatarURL())
        .setColor('0x00AAFF');
      botlog.send({ msgDel });
    }
  }
};

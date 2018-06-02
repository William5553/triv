const Discord = require('discord.js');
exports.run = (client, msg) => {
  const user = msg.mentions.users.first();
  if (msg.mentions.users.size < 1) return msg.reply('You must mention someone to measure their hole.').catch(console.error);
  if (client.channels.find('name','nsfw')) return msg.reply('I cannot find a nsfw channel');
  var size = Math.floor(Math.random() * 15 + 1);

  const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .setDescription(`**Action:** Clit\n**Target:** <@${user.id}>\n**Measurer:** <@${msg.author.id}>\n **Length:** ` + size +  'inch(es)');
  return client.channels.find('name','nsfw').send({embed});

};













exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'clit',
  description: 'Measures the mentioned users clit.',
  usage: 'clit [mention]'
};

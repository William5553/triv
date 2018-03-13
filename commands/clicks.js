const Discord = require('discord.js');
exports.run = (client, msg) => {
  const user = msg.mentions.users.first();
  if (msg.mentions.users.size < 1) return msg.reply('You must mention someone to measure their hole.').catch(console.error);
  if (client.channels.find('name','nsfw')) return msg.reply('I cannot find a nsfw channel');
  if (user.id === '186620503123951617') return msg.reply('Sorry but, my master is male');
  var size = Math.floor(Math.random() * 15 + 1);

  const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .setDescription(`**Action:** Clit\n**Target:** ${user.tag}\n**Measurer:** ${msg.author.tag}\n **Length:** ` + size +  'inch(es)');
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

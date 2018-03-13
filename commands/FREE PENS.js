const Discord = require('discord.js');
exports.run = (client, msg) => {

  let user = msg.mentions.users.first();
  let nsfw = client.channels.find('name', 'nsfw');
  if (!nsfw) return msg.reply('I cannot find a nsfw channel');
  //var Willpen = Math.floor(Math.random() * 100) + 1;
  if (msg.mentions.users.first === '186620503123951617') return msg.channel.send(user + '\'s penis is" + size + "inches long.');
  if (msg.mentions.users.size < 1) return msg.reply('You must mention someone to mesasure them.').catch(console.error);
  var size = Math.floor(Math.random() * 15) + 1;

  const embed = new Discord.RichEmbed()
      .setColor(0x00AE86)
      .setTimestamp()
      .setDescription(`**Action:** Penis\n**Target:** ${user.tag}\n**Measurer:** ${msg.author.tag}\n **Length:** ` + size + ' inch(es)');
  return client.channels.get(nsfw.id).send({embed});

};







exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'penis',
  description: 'Measures the mentioned users penis.',
  usage: 'penis [mention]'
};

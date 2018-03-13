const Discord = require('discord.js');
exports.run = (client, msg) => {
  const user = msg.mentions.users.first();
  const nsfw = client.channels.find('name', 'nsfw');
  if (msg.mentions.users.size < 1) return msg.reply('Who do you want to fuck?').catch(console.error);
  if (!nsfw) return msg.reply('I cannot find a nsfw channel');

  const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .setDescription(`**Action:** Fuck \n<@${msg.author.id}> just fucked ` + user);
  return client.channels.get(nsfw.id).send({embed});

};













exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'fuck',
  description: 'Fucks the mentioned user.',
  usage: 'fuck [mention]'
};

const Discord = require('discord.js');
exports.run = (client, msg) => {
  const user = msg.mentions.users.first();
  const nsfw = client.channels.find('name', 'nsfw');
  if (!nsfw) return msg.channel.send('I cannot find a nsfw channel');
  if (msg.mentions.users.size < 1) return msg.channel.send('You must mention someone to rape them.').catch(console.error);

  const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .setDescription(`**Action:** Rape\n${msg.author.tag} just raped ` + user);
  return client.channels.get(nsfw.id).send({embed});

};













exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'rape',
  description: 'Rapes people.',
  usage: 'rape [mention]'
};

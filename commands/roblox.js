const fetch = require('node-superfetch');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  const { user } = message.mentions.members.first() || message.guild.members.cache.get(args.join(' ')) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLowerCase()) || message.member;
  if (!user) return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
  const m = await message.channel.send('Getting...');
  let data;
  const embeds = [];
  try {
    data = await fetch.get(`https://verify.eryn.io/api/user/${user.id}`);
    if (!data.body.error)
      embeds.push(new MessageEmbed()
        .setFooter(`Username: ${data.body.robloxUsername} | User ID: ${data.body.robloxId}`)
        .setTitle('Account found on Eryn')
        .setDescription(`https://roblox.com/users/${data.body.robloxId}/profile`)
        .setColor(0x00ae86));
    else
      embeds.push(new MessageEmbed()
        .setTitle('No account found on Eryn')
        .setColor('RED')
        .setDescription(data.body.error));
  } catch {
    embeds.push(new MessageEmbed()
      .setTitle('No account found on Eryn')
      .setColor('RED'));
  }
  try {
    data = await fetch.get(`https://api.blox.link/v1/user/${user.id}`);
    if (!data.body.error) 
      embeds.push(new MessageEmbed()
        .setFooter(`User ID: ${data.body.primaryAccount}`)
        .setTitle('Account found on Bloxlink')
        .setDescription(`https://roblox.com/users/${data.body.primaryAccount}/profile`)
        .setColor(0x00ae86));
    else {
      embeds.push(new MessageEmbed()
        .setTitle('No account found on Bloxlink')
        .setDescription(data.body.error)
        .setColor('RED'));
    }
  } catch {
    embeds.push(new MessageEmbed()
      .setTitle('No account found on Bloxlink')
      .setColor('RED'));
  }
  message.channel.send({ embeds });
  m.delete();
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['rbx', 'rblx'],
  permLevel: 0,
  cooldown: 3000
};

exports.help = {
  name: 'roblox',
  description: "Attempts to get a discord user's roblox username",
  usage: 'roblox [discord user]',
  example: 'roblox @Robloxian'
};

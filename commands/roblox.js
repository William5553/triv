const fetch = require('node-superfetch'),
  { MessageEmbed } = require('discord.js');

exports.run = (client, message) => {
const user = message.mentions.users.first();
if (!user) return message.channel.send(`Usage: ${client.settings.prefix}${exports.help.usage}`);
const { body } = fetch.get(`https://verify.eryn.io/api/user/${user.id}`);
message.channel.send(new MessageEmbed()
.setTitle(body.robloxUsername)
.setURL(`https://roblox.com/users/${body.robloxId}/profile`)
);
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'roblox',
  description: "Attempts to get a discord user's roblox username",
  usage: 'roblox [discord user]'
};

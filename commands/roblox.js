const fetch = require('node-superfetch'),
  { MessageEmbed } = require('discord.js');

exports.run = (client, message) => {
const user = message.mentions.users.first();
if (!user) return message.channel.send(`Usage: ${client.settings.prefix}${exports.help.usage}`);
const { body } = fetch.get(`https://verify.eryn.io/api/user/${user.id}`);
  if (body.status === 'error' && body.errorCode == 404)
    return message.reply('they have not linked their Roblox account to their Discord account yet');
  else if (body.status === 'error')
    return message.reply('an error occurred');
const headShot = fetch
.get('https://thumbnails.roblox.com/v1/users/avatar-headshot')
.query({
    userIds: body.robloxId,
  size: '150x150',
  format: 'Png',
  isCircular: true
});
message.channel.send(new MessageEmbed()
.setAuthor(body.robloxUsername, headShot.body.imageUrl)
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

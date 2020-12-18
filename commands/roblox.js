const fetch = require('node-superfetch'),
  { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
const user = message.mentions.users.first();
if (!user) return message.channel.send(`Usage: ${client.settings.prefix}${exports.help.usage}`);
const { body } = await fetch.get(`https://verify.eryn.io/api/user/${user.id}`);
  if (body.status === 'error' && body.errorCode == 404)
    return message.reply('they have not linked their Roblox account to their Discord account yet');
  else if (body.status === 'error')
    return message.reply('an error occurred');
message.channel.send(new MessageEmbed()
                     .setDescription(`[${body.robloxUsername}](https://roblox.com/users/${body.robloxId}/profile)`)
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

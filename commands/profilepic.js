exports.run = (client, message, args) => {
  const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLowerCase()) || message.member;
  message.channel.send(member.user.displayAvatarURL({size: 4096, dynamic: true}));
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0,
  cooldown: 1000
};

exports.help = {
  name: 'profilepic',
  description: 'Gets the profile picture of a user',
  usage: 'profilepic [user]'
};

exports.run = (client, message, args) => {
  const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLowerCase());
  member.setNickname(args.splice(1).join(' '));

  client.infractions.ensure(message.guild.id, { [member.id]: [] });
  client.infractions.push(message.guild.id, {'type': 'Update Nickname', 'timestamp': Date.now(), 'mod': message.author.id}, member.id);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['nick'],
  permLevel: 2,
  cooldown: 1000
};

exports.help = {
  name: 'nickname',
  description: 'Changes the nickname of another member',
  usage: 'nickname [user] [new nickname]'
};

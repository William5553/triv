exports.run = (client, message, args) => {
  const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLowerCase());
  const oldNick = member.displayName;
  const newNick = args.splice(1).join(' ');
  member.setNickname(newNick);
  message.channel.send(`Updated ${member.toString()}'s nickname from ${oldNick} to ${newNick}`);

  client.infractions.ensure(message.guild.id, { [member.id]: [] });
  client.infractions.push(message.guild.id, {
    type: 'Update Nickname',
    timestamp: Date.now(),
    mod: message.author.id,
    additional: [
      {
        title: 'Old Nickname',
        body: oldNick
      },
      {
        title: 'New Nickname',
        body: newNick
      }
    ]
  }, member.id);
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

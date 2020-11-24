exports.parseUser = (message, user) => {
  const member = message.guild.members.fetch(user) || null;
  if (user.id === message.author.id) {
    return message.reply('you can\'t do that to yourself, why did you try, you idiot');
  } else if (member) {
    if (member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send('That member is higher or equal to you');
  }
  return user;
};

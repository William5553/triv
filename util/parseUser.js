exports.parseUser = (message, member) => {
  if (member.user.id === message.author.id)
    return message.reply("you can't do that to yourself, why did you try, you idiot");
  else if (member && member.roles && member.roles.highest.position >= message.member.roles.highest.position)
      return message.channel.send('That member is higher or equal to you');
  return true;
};

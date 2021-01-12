exports.parseUser = (message, member) => {
  if (member.user.id === message.author.id)
    return message.reply("you can't do that to yourself, why did you try, you idiot");
  if (member && member.roles && member.roles.highest.position >= message.member.roles.highest.position)
    return message.reply('that member is higher or equal to you');
  if (member && member.roles && member.roles.highest.position >= message.guild.me.roles.highest.position)
    return message.reply('that member is higher or equal to me');
  return true;
};

exports.parseUser = (message, member) => {
  if (member.user.id === message.client.settings.owner_id)
    return message.reply('no!');
  if (member.user === message.client.user)
    return message.reply('you are an idiot');
  if (member.user === message.author)
    return message.reply("you can't do that to yourself, why did you try? you are an idiot.");
  if (member && member.roles && member.roles.highest.position >= message.member.roles.highest.position)
    return message.reply('that member is higher or equal to you. L');
  if (member && member.roles && member.roles.highest.position >= message.guild.me.roles.highest.position)
    return message.reply('that member is higher or equal to me, try moving my role higher');
  return true;
};

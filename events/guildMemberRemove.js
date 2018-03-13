module.exports = member => {
  const message = message.content.toLowerCase();
  message.channel.send(`${member.user.username} just poofed into thin air!`);
};

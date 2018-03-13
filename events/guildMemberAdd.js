module.exports = member => {
  const message = require('./message.js');
  message.channel.send(`${member.user.username} just joined!`);
};

module.exports = (guild, user) => {
  const message = require('./message.js');
  message.channel.send(`${user.username} just got the ban hammer!`);
};

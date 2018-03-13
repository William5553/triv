const chalk = require('chalk');
module.exports = client => {
  console.log(chalk.bgGreen.black('READY!'));
  if (client.guilds.size >= 2) {
    client.user.setGame(`~help | ${client.guilds.size} guilds!`);
  } else {
    client.user.setGame(`~help | ${client.guilds.size} guild!`);
  }
};

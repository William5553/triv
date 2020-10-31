const chalk = rconst chalk = require('chalk');
module.exports = client => {
  console.log(chalk.bgGreen.black('READY!'));
  if (client.guilds.size >= 2) {
    client.user.setActivity(`~help | ${client.guilds.size} guilds`, { type: 'LISTENING'});
  } else {
    client.user.setActivity(`~help | ${client.guilds.size} guild`, { type: 'LISTENING'});
  }
};

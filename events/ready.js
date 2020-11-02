const chalk = require('chalk');
const settings = require('../settings.json');
module.exports = client => {
  console.log(chalk.bgGreen.black('READY!'));
  if (client.guilds.cache.size >= 2) {
    client.user.setActivity(`${settings.prefix}help | ${client.guilds.cache.size} guilds`, { type: 'LISTENING'});
  } else {
    client.user.setActivity(`${settings.prefix}help | ${client.guilds.cache.size} guild`, { type: 'LISTENING'});
  }
};

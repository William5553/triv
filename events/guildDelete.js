const fs = require('fs');
module.exports = guild => {
  if (!guild.available) return guild.client.logger.error('guild is not available');
  const xp = JSON.parse(require('../xp.json'));
  
  if (xp[guild.id]) {
    delete xp[guild.id];
  }
  
  fs.writeFile('../xp.json', JSON.stringify(xp), err => {
    if (err) guild.client.logger.error(err);
  });
};

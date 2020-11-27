const fs = require('fs');
const path = require('path');
module.exports = guild => {
  if (!guild.available) return guild.client.logger.error('guild is not available');
  const xp = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'xp.json'), 'utf-8'));
  
  if (xp[guild.id]) {
    delete xp[guild.id];
  }
  fs.writeFile(path.resolve(process.cwd(), 'xp.json'), JSON.stringify(xp), err => {
    if (err) guild.client.logger.error(err);
  });
};

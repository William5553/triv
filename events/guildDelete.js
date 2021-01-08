const fs = require('fs'),
  path = require('path');
module.exports = guild => {
  const warnings = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'warnings.json'), 'utf-8'));

  if (warnings[guild.id]) {
    delete warnings[guild.id];
  }
  fs.writeFile(path.resolve(process.cwd(), 'warnings.json'), JSON.stringify(warnings), err => {
    if (err) guild.client.logger.error(err);
  });
};
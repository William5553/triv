const fs = require('fs'),
  path = require('path');
module.exports = (client, guild) => {
  let warnings;
  try {
    warnings = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'warnings.json'), 'utf-8'));
  } catch {
    return;
  }
  if (warnings[guild.id]) delete warnings[guild.id];
  fs.writeFile(path.resolve(process.cwd(), 'warnings.json'), JSON.stringify(warnings), err => {
    if (err) client.logger.error(err);
  });
};

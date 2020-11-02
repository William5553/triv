const settings = require('../settings.json');
module.exports = message => {
  if (message.author.bot || !message.guild) return;  
  if (!message.content.startsWith(settings.prefix)) return;
  const command = message.content.split(' ')[0].slice(settings.prefix.length);
  const params = message.content.split(' ').slice(1);
  const perms = message.client.elevation(message);
  let cmd;
  if (message.client.commands.has(command)) {
    cmd = message.client.commands.get(command);
  } else if (message.client.aliases.has(command)) {
    cmd = message.client.commands.get(message.client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    cmd.run(message.client, message, params, perms);
  }
};

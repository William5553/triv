const settings = require('../settings.json');
module.exports = message => {
  const { client } = message;
  if (message.author.bot || !message.guild || !message.content.startsWith(settings.prefix)) return;
  const command = message.content.split(' ')[0].slice(settings.prefix.length);
  const params = message.content.split(' ').slice(1);
  const perms = client.elevation(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms).catch(client.logger.error);
  }
};

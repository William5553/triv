const settings = require('../settings.json');
module.exports = message => {
  const { client } = message;
  if (message.author.bot || !message.content.startsWith(settings.prefix)) return;
  const command = message.content.split(' ')[0].slice(settings.prefix.length).toLowerCase();
  const params = message.content.split(' ').slice(1);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (message.channel.type === 'dm' && cmd.conf.name === 'help') {
    cmd.run(client, message, params);
  }
  if (!message.guild) return;
  const perms = client.elevation(message);
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms);
  }
};

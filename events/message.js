const settings = require('../settings.json');
module.exports = message => {
  const { client } = message;
  if (message.author.bot || !(message.content.startsWith(`<@!${client.user.id}> `) || message.content.startsWith(settings.prefix))) return;
  let command, args;
  if (message.content.startsWith(settings.prefix))
    command = message.content.split(' ')[0].slice(settings.prefix.length).toLowerCase();
    args = message.content.split(' ').slice(1);
  if (message.content.startsWith(`<@!${client.user.id}> `))
    command = message.content.split(' ')[1].toLowerCase();
    args = message.content.split(' ').slice(2);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (!message.guild) {
      if (cmd.conf.guildOnly === false) {
        if (cmd.conf.permLevel === 4 && message.author.id !== settings.ownerid) return message.reply("you don't have the perms for that");
        return cmd.run(client, message, args, 3);
      }
      else if (cmd.conf.guildOnly === true)
        return message.reply('that command can only be used in a guild, get some friends.');
      else
        return client.logger.warn(`${cmd.help.name}'s guildOnly should be a boolean but it is ${cmd.conf.guildOnly}`);
    }
    const perms = client.elevation(message);
    if (perms < cmd.conf.permLevel) return message.reply("you don't have the perms for that");
    cmd.run(client, message, args, perms);
  }
};

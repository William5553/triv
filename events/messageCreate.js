const ms = require('ms');

module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (new RegExp(`^<@!?${client.user.id}>`, 'i').test(message.content))
    return message.reply(`My prefix on this guild is \`${client.getPrefix(message)}\``);
  if (!message.content.startsWith(client.getPrefix(message))) return;
  if (client.blacklist.get('blacklist', 'user').includes(message.author.id))
    message.reply("You're blacklisted :joy::joy::joy:");
  if (client.owneronlymode && !client.owners.includes(message.author.id)) return message.reply('The bot is currently in owner only mode.');
  const command = message.content.split(' ')[0].slice(client.getPrefix(message).length).toLowerCase();
  const args = message.content.split(' ').slice(1);
  let cmd;
  if (client.commands.has(command))
    cmd = client.commands.get(command);
  else if (client.aliases.has(command))
    cmd = client.commands.get(client.aliases.get(command));
  if (!cmd) return;
  if (cmd.conf.cooldown && cmd.conf.cooldown > 0 && !client.owners.includes(message.author.id)) {
    client.cooldowns.ensure(message.author.id, {});
    const cooldownDB = client.cooldowns.get(message.author.id, cmd.help.name);
    if (cooldownDB != undefined && cmd.conf.cooldown - (Date.now() - cooldownDB) > 0) {
      const time = cmd.conf.cooldown - (Date.now() - cooldownDB);
      return message.reply(`You must wait **${ms(time)}** before using this command again!`);
    }
  }
  if (!message.guild) {
    if (!cmd.conf.guildOnly) {
      if (cmd.conf.permLevel >= 10 && !client.owners.includes(message.author.id))
        return message.reply("You don't have the perms for that");
      if (cmd.conf.cooldown && cmd.conf.cooldown > 0)
        client.cooldowns.set(message.author.id, Date.now(), cmd.help.name);
      return cmd.run(client, message, args, 9);
    } else if (cmd.conf.guildOnly)
      return message.reply('That command can only be used in a guild, get some friends.');
  } else {
    client.guildData.ensure(message.guild.id);
    const perms = client.elevation(message.member);
    if (perms < cmd.conf.permLevel)
      return message.reply("You don't have the perms for that");
    if (client.guildData.includes(message.guild.id, cmd.help.name, 'disabled'))
      return message.reply(`\`${cmd.help.name}\` has been disabled by a server admin`);
    if (cmd.conf.cooldown && cmd.conf.cooldown > 0)
      client.cooldowns.set(message.author.id, Date.now(), cmd.help.name);
    return cmd.run(client, message, args, perms);
  }
};

const ms = require('ms');

module.exports = async (client, message) => {
  if (message.author.bot) return;
  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(prefixMention))
    return message.reply(`my prefix on this guild is \`${process.env.prefix}\``);
  if (!message.content.startsWith(process.env.prefix)) return;
  if (client.blacklist.get('blacklist', 'user').includes(message.author.id)) {
    message.delete({ timeout: 1500 });
    const a = await message.reply('you are blacklisted');
    return a.delete({ timeout: 1500 });
  }
  if (client.owneronlymode && !client.owners.includes(message.author.id)) return message.reply('The bot is currently in owner only mode.');
  const command = message.content.split(' ')[0].slice(process.env.prefix.length).toLowerCase();
  const args = message.content.split(' ').slice(1);
  let cmd;
  if (client.commands.has(command))
    cmd = client.commands.get(command);
  else if (client.aliases.has(command))
    cmd = client.commands.get(client.aliases.get(command));
  if (!cmd) return;
  if (cmd.conf.cooldown && cmd.conf.cooldown > 0) {
    client.cooldowns.ensure(message.author.id, {});
    const cooldownDb = client.cooldowns.get(message.author.id, cmd.help.name);
    if (cooldownDb !== null && cmd.conf.cooldown - (Date.now() - cooldownDb) > 0) {
      const time = cmd.conf.cooldown - (Date.now() - cooldownDb);
      const m = await message.reply(`you must wait **${ms(time)}** before using this command again!`);
      m.delete({ timeout: time });
      return;
    }
  }
  if (!message.guild) {
    if (!cmd.conf.guildOnly) {
      if (cmd.conf.permLevel >= 10 && !client.owners.includes(message.author.id))
        return message.reply("you don't have the perms for that");
      if (cmd.conf.cooldown && cmd.conf.cooldown > 0) client.cooldowns.set(message.author.id, Date.now(), cmd.help.name);
      return cmd.run(client, message, args, 9);
    } else if (cmd.conf.guildOnly)
      return message.reply('that command can only be used in a guild, get some friends.');
  } else {
    const perms = client.elevation(message.member);
    if (perms < cmd.conf.permLevel)
      return message.reply("you don't have the perms for that");
    if (cmd.conf.cooldown && cmd.conf.cooldown > 0) client.cooldowns.set(message.author.id, Date.now(), cmd.help.name);
    return cmd.run(client, message, args, perms);
  }
};

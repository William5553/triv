const ms = require('ms'),
  db = require('quick.db');
module.exports = async (client, message) => {
  if (message.author.bot) return;
  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(prefixMention))
    return message.reply(`my prefix on this guild is \`${process.env.prefix}\``);
  if (!message.content.startsWith(process.env.prefix)) return;
  if (client.blacklist.user.includes(message.author.id)) {
    message.delete({ timeout: 1500 });
    const a = await message.reply('you are blacklisted');
    return a.delete({ timeout: 1500 });
  }
  const command = message.content.split(' ')[0].slice(process.env.prefix.length).toLowerCase();
  const args = message.content.split(' ').slice(1);
  let cmd;
  if (client.commands.has(command))
    cmd = client.commands.get(command);
  else if (client.aliases.has(command))
    cmd = client.commands.get(client.aliases.get(command));
  if (!cmd) return;
  if (cmd.conf.cooldown && cmd.conf.cooldown > 0) {
    const cooldownDb = await db.fetch(`cooldown_${cmd.help.name}_${message.author.id}`);
    if (cooldownDb !== null && cmd.conf.cooldown - (Date.now() - cooldownDb) > 0) {
      const time = ms(cmd.conf.cooldown - (Date.now() - cooldownDb));
      const m = await message.reply(`you must wait **${time}** before using this command again!`);
      m.delete({ timeout: cmd.conf.cooldown - (Date.now() - cooldownDb) });
      return;
    }
  }
  if (!message.guild) {
    if (!cmd.conf.guildOnly) {
      if (cmd.conf.permLevel >= 10 && !client.owners.includes(message.author.id))
        return message.reply("you don't have the perms for that");
      db.set(`cooldown_${cmd.help.name}_${message.author.id}`, Date.now());
      return cmd.run(client, message, args, 9);
    } else if (cmd.conf.guildOnly)
      return message.reply('that command can only be used in a guild, get some friends.');
  } else {
    const perms = client.elevation(message.member);
    if (perms < cmd.conf.permLevel)
      return message.reply("you don't have the perms for that");
    db.set(`cooldown_${cmd.help.name}_${message.author.id}`, Date.now());
    return cmd.run(client, message, args, perms);
  }
};

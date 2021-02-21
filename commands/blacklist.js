const types = ['user', 'guild'];

exports.run = async (client, message, args) => {
  if (args.length < 2) return message.reply(`Usage: ${client.settings.prefix}${exports.help.usage}`);
  const type = args[0].toLowerCase();
  if (!type || !types.includes(type)) return message.reply(`First argument should be ${types.join(' OR ')}.`);
  const target = args[1];
  if (!target || isNaN(target)) return message.reply(`Usage: ${client.settings.prefix}${exports.help.usage}`);
  if (type === 'user' && client.owners.includes(target)) return message.reply("don't be an idiot.");
  if (client.blacklist[type].includes(target)) return message.channel.send(`🔨 \`${target}\` is already blacklisted.`);
  client.blacklist[type].push(target);
  client.exportBlacklist();
  if (type === 'guild') {
    try {
      const guild = await client.guilds.fetch(target, false);
      await guild.leave();
    } catch {
      await message.channel.send('🔨 Failed to leave guild.');
    }
  }
  if (type === 'user') {
    const guildsLeft = [];
    const failedToLeave = [];
    for (const guild of client.guilds.cache.values()) {
      if (guild.ownerID === target) {
        try {
          await guild.leave();
          guildsLeft.push(guild.name);
        } catch {
          failedToLeave.push(guild.id);
        }
      }
    }
    const formatFailed = failedToLeave.length ? failedToLeave.map(id => `\`${id}\``).join(', ') : '_None_';
    await message.channel.send(`🔨 Left ${guildsLeft.length} guilds owned by this user. Failed to leave: ${formatFailed}`);
    if (guildsLeft.length > 0) message.channel.send(`Left the guilds ${guildsLeft.map(name => `**${name}**`).join(', ')}`);
  }
  return message.channel.send(`🔨 Blacklisted ${type} \`${target}\`.`);
};
  
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 10
};
  
exports.help = {
  name: 'blacklist',
  description: 'Blacklists a user or server',
  usage: 'blacklist [type] [id]'
};
  
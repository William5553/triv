const types = ['user', 'guild'];

exports.run = (client, message, args) => {
  if (args.length < 2) return message.reply(`Usage: ${client.settings.prefix}${exports.help.usage}`);
  const type = args[0].toLowerCase();
  if (!type || !types.includes(type)) return message.reply(`First argument should be ${types.join(' OR ')}.`);
  const target = args[1];
  if (!target || isNaN(target)) return message.reply(`Usage: ${client.settings.prefix}${exports.help.usage}`);
  if (!client.blacklist[type].includes(target)) return message.channel.send(`🔨 \`${target}\` is not blacklisted.`);
  const index = client.blacklist[type].indexOf(target);
  if (index > -1)
    client.blacklist[type].splice(index, 1);
  client.exportBlacklist();
  return message.channel.send(`🔨 Unblacklisted ${type} \`${target}\`.`);
};
  
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 10
};
  
exports.help = {
  name: 'unblacklist',
  description: 'Unblacklists a user or server',
  usage: 'unblacklist [user]'
};
  
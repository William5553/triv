exports.run = async (client, message, args) => {
  if (args.length < 2) return message.reply(`usage: ${client.getPrefix(message)}${exports.help.usage}`);
  message.delete();
  const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLowerCase());
  const webhook = await message.channel.createWebhook(member.displayName, { avatar: member.user.displayAvatarURL({ dynamic: true }) });
  await webhook.send(args.slice(1).join(' '));
  webhook.delete();
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['imp'],
  permLevel: 10
};

exports.help = {
  name: 'impersonate',
  description: 'Impersonate someone',
  usage: 'impersonate',
  example: 'impersonate @joe hey everyone'
};

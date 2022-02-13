exports.run = async (client, message, args) => {
  if (args.length < 2) return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
  message.delete();
  const member = message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLowerCase()) || message.mentions.members.first();
  if (!member) return message.reply('Specify a person, dumbass');
  const webhook = await message.channel.createWebhook(member.displayName, { avatar: member.user.displayAvatarURL({ dynamic: true }) });
  await webhook.send(args.slice(1).join(' '));
  webhook.delete();
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['imp', 'imposter'],
  permLevel: 10
};

exports.help = {
  name: 'impersonate',
  description: 'Impersonate someone',
  usage: 'impersonate [user] [message]',
  example: 'impersonate @joe hey everyone'
};

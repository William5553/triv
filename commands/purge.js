exports.run = async (client, message, args) => {
  const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.slice(1).join(' ').toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.slice(1).join(' ').toLowerCase());
  await message.delete(); // delete the command message, so it doesn't interfere with the messages we are going to delete.
  let mgct = Number(args[0]);
  if (!mgct || isNaN(mgct) || mgct < 1) return message.channel.send(`Usage: ${process.env.prefix}${exports.help.usage}`).then(m => m.delete({ timeout: 4500 }));
  if (mgct > 100) mgct = 100;
  message.channel.messages
    .fetch({ limit: 100 })
    .then(messages => {
      if (member && member.user)
        messages = messages.filter(m => m.author.id === member.user.id).array().slice(0, mgct);
      else
        messages = messages.array().slice(0, mgct);
      message.channel
        .bulkDelete(messages, true)
        .catch(e => message.channel.send(e.message ? e.message : e));
    });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['prune'],
  permLevel: 2,
  cooldown: 1000
};

exports.help = {
  name: 'purge',
  description: 'Deletes the specified amount of messages.',
  usage: 'purge [amount] [user (optional)]'
};

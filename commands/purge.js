exports.run = async (client, message, args) => {
  const user = message.mentions.users.first();
  await message.delete(); // delete the command message, so it doesn't interfere with the messages we are going to delete.
  let mgct = Number(args[0]);
  if (!mgct || isNaN(mgct) || mgct < 1) return message.channel.send(`Usage: ${client.settings.prefix}${exports.help.usage}`).then(m => m.delete({ timeout: 4500 }));
  if (mgct > 100) mgct = 100;
  message.channel.messages
    .fetch({ limit: 100 })
    .then(messages => {
      if (user)
        messages = messages.filter(m => m.author.id === user.id).array().slice(0, mgct);
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
  permLevel: 2
};

exports.help = {
  name: 'purge',
  description: 'Deletes the specified amount of messages.',
  usage: 'purge [amount] [user (optional)]'
};

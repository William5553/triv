const settings = require('../settings.json');

exports.run = (client, message, args) => {
  const user = message.mentions.users.first(),
    lim = Number(args[1]);
  if (!user || !lim) message.reply(`Usage: ${settings.prefix}${exports.help.usage}`);
  message.channel.messages
    .fetch({ limit: 100 })
    .then(messages => {
      messages = messages.filter(m => m.author.id === user.id).array().slice(0, lim);   
      message.channel
        .bulkDelete(messages)
        .catch(error => client.logger.log(error.stack));
    });
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['pruneuser'],
  permLevel: 2
};

exports.help = {
  name: 'purgeuser',
  description: 'Deletes the specified amount of messages by a user',
  usage: 'purge [user] [amount]'
};

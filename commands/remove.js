const { canModifyQueue } = require('../util/Util');

exports.run = (client, message, args) => {
  const queue = client.queue.get(message.guild.id);
  if (!queue) return message.reply("there ain't a queue").catch(client.logger.error);
  if (canModifyQueue(message.member) != true) return;
  if (!args.length || isNaN(args[0])) return message.reply(`${client.getPrefix(message)}${exports.help.usage}`);

  const song = queue.songs.splice(args[0] - 1, 1);
  queue.textChannel.send(`${message.author} ❌ removed **${song[0].title}** from the queue.`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'remove',
  description: 'Removes song from queue',
  usage: 'remove [queue number]'
};

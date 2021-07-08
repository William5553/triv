const { canModifyQueue } = require('../util/Util');

exports.run = (client, message, args) => {
  const queue = client.queue.get(message.guild.id);
  if (!queue) return message.reply("There ain't a queue");
  const modifiable = canModifyQueue(message.member);
  if (modifiable != true) return message.reply(modifiable);
  if (!args.length || isNaN(args[0])) return message.reply(`${client.getPrefix(message)}${exports.help.usage}`);

  const song = queue.songs.splice(args[0] - 1, 1);
  queue.textChannel.send(`${message.author} ❌ removed **${song[0].title}** from the queue.`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0,
  cooldown: 2000
};

exports.help = {
  name: 'remove',
  description: 'Removes song from queue',
  usage: 'remove [queue number]',
  example: 'remove 3'
};

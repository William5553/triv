const { canModifyQueue } = require('../util/Util');

exports.run = (client, message) => {
  const queue = client.queue.get(message.guild.id);
  if (!queue) return message.reply('There is nothing playing.');
  if (canModifyQueue(message.member) != true) return;

  const songs = queue.songs;
  for (let i = songs.length - 1; i > 1; i--) {
    const j = 1 + Math.floor(Math.random() * i);
    [songs[i], songs[j]] = [songs[j], songs[i]];
  }
  queue.songs = songs;
  client.queue.set(message.guild.id, queue);
  queue.textChannel.send(`${message.author} 🔀 shuffled the queue`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0,
  cooldown: 10000
};

exports.help = {
  name: 'shuffle',
  description: 'Shuffles the queue',
  usage: 'shuffle',
  example: 'shuffle'
};

const { canModifyQueue } = require('../util/queue');

exports.run = (client, message) => {
  const queue = client.queue.get(message.guild.id);
  if (!queue) return message.channel.send('There is no queue.').catch(client.logger.error);
  if (canModifyQueue(message.member) != true) return;

  const songs = queue.songs;
  for (let i = songs.length - 1; i > 1; i--) {
    const j = 1 + Math.floor(Math.random() * i);
    [songs[i], songs[j]] = [songs[j], songs[i]];
  }
  queue.songs = songs;
  client.queue.set(message.guild.id, queue);
  queue.textChannel.send(`${message.author} 🔀 shuffled the queue`).catch(client.logger.error);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'shuffle',
  description: 'Shuffles the queue',
  usage: 'shuffle'
};

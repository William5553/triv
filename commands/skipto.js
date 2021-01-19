const { canModifyQueue } = require('../util/queue');

exports.run = (client, message, args) => {
  if (args.length < 1 || isNaN(args[0])) return message.reply(`${client.settings.prefix}${exports.help.usage}`).catch(client.logger.error);

  const queue = client.queue.get(message.guild.id);
  if (!queue) return message.reply('there is nothing playing').catch(client.logger.error);
  if (canModifyQueue(message.member) != true) return;

  if (args[0] > queue.songs.length)
    return message.reply(`the queue is only ${queue.songs.length} songs long`).catch(client.logger.error);

  queue.playing = true;
  if (queue.loop) {
    for (let i = 0; i < args[0] - 2; i++)
      queue.songs.push(queue.songs.shift());
  } else
    queue.songs = queue.songs.slice(args[0] - 2);
  queue.connection.dispatcher.end();
  queue.textChannel.send(`${message.author} ⏭ skipped ${Number(args[0]) - 1} songs`).catch(client.logger.error);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'skipto',
  description: 'Skip to the selected queue number',
  usage: 'skipto [queue number]'
};

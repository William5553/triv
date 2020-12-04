const { canModifyQueue } = require('../util/queue');
const settings = require('../settings.json');

exports.run = (client, message, args) => {
  if (!args.length) return message.reply(`${settings.prefix}${exports.help.usage}`).catch(client.logger.error);

  if (isNaN(args[0])) return message.reply(`${settings.prefix}${exports.help.usage}`).catch(client.logger.error);

  const queue = client.queue.get(message.guild.id);
  if (!queue) return message.channel.send('There is no queue.').catch(client.logger.error);
  if (!canModifyQueue(message.member)) return;

  if (args[0] > queue.songs.length)
    return message.reply(`The queue is only ${queue.songs.length} songs long!`).catch(client.logger.error);

  queue.playing = true;
  if (queue.loop) {
    for (let i = 0; i < args[0] - 2; i++) {
      queue.songs.push(queue.songs.shift());
    }
  } else {
    queue.songs = queue.songs.slice(args[0] - 2);
  }
  queue.connection.dispatcher.end();
  queue.textChannel.send(`${message.author} ⏭ skipped ${args[0] - 1} songs`).catch(client.logger.error);
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

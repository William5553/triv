const { canModifyQueue } = require('../util/Util');

exports.run = (client, message) => {
  const queue = client.queue.get(message.guild.id);
  if (!queue) return message.reply('There is nothing playing.').catch(client.logger.error);
  if (canModifyQueue(message.member) != true) return;

  if (queue.playing) {
    queue.playing = false;
    queue.connection.dispatcher.pause(true);
    return queue.textChannel.send(`${message.author} ⏸ paused the music.`).catch(client.logger.error);
  } else {
    queue.playing = true;
    queue.connection.dispatcher.resume();
    return queue.textChannel.send(`${message.author} ▶ resumed the music!`).catch(client.logger.error);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['unpause', 'resume'],
  permLevel: 0,
  cooldown: 2000
};

exports.help = {
  name: 'pause',
  description: 'Pauses the music',
  usage: 'pause',
  example: 'pause'
};

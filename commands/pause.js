const { canModifyQueue } = require('../util/Util');

exports.run = (client, message) => {
  const queue = client.queue.get(message.guild.id);
  if (!queue) return message.reply('There is nothing playing.');
  if (canModifyQueue(message.member) != true) return;

  if (queue.playing) {
    queue.playing = false;
    queue.player.pause();
    return queue.textChannel.send(`${message.author} ⏸ paused the music.`);
  } else {
    queue.playing = true;
    queue.player.unpause();
    return queue.textChannel.send(`${message.author} ▶ resumed the music!`);
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

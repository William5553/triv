const { play } = require('../util/play'),
  { canModifyQueue } = require('../util/queue');
exports.run = (client, message, args) => {
  const queue = client.queue.get(message.guild.id);
  if (!queue) return message.reply('nothing is playing');
  if (isNaN(args[0])) return message.reply(`Usage: ${client.settings.prefix}${exports.help.usage}`);
  if (canModifyQueue(message.member) != true) return;
  queue.additionalTime = queue.additionalTime + tonumber(args[0])*1000;
  if (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime + queue.additionalStreamTime > song.duration*1000) return message.reply("you can't fast forward past the song's end");
  play(queue.songs[0], message, true); 
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['ff'],
  permLevel: 0
};

exports.help = {
  name: 'fastforward',
  description: 'Fast forwards the current song by the specified seconds',
  usage: 'fastforward [seconds]'
};

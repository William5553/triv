const { play } = require('../util/play'),
  { canModifyQueue } = require('../util/Util');
exports.run = async (client, message, args) => {
  const queue = client.queue.get(message.guild.id);
  if (!queue || !queue.connection) return message.reply('nothing is playing');
  if (isNaN(args[0])) return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
  if (canModifyQueue(message.member) != true) return;
  if (Number(args[0]) > 1000) return message.reply('you can only fast forward up to 1000 seconds.');
  queue.additionalStreamTime += Number(args[0])*1000;
  if (queue.connection.dispatcher.totalStreamTime + queue.additionalStreamTime < 0) queue.additionalStreamTime = 0;
  if (queue.connection.dispatcher.totalStreamTime + queue.additionalStreamTime > queue.songs[0].duration*1000) return message.reply("you can't fast forward past the song's end");
  play(queue.songs[0], message, true); 
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['ff'],
  permLevel: 0,
  cooldown: 5000
};

exports.help = {
  name: 'fastforward',
  description: 'Fast forwards the current song by the specified seconds',
  usage: 'fastforward [seconds]',
  example: 'fastforward 60'
};

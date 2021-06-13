const { canModifyQueue } = require('../util/Util');

exports.run = async (client, message, args) => {
  const queue = client.queue.get(message.guild.id);
  if (!queue || !queue.connection) return message.reply('Nothing is playing');
  if (isNaN(args[0])) return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
  if (canModifyQueue(message.member) != true) return;
  if (Number(args[0]) > 1000) return message.reply('You can only fast forward up to 1000 seconds.');
  if (queue.resource.playbackDuration + queue.additionalStreamTime < 0) queue.additionalStreamTime = 0;
  if (queue.resource.playbackDuration + Number(args[0]) * 1000 > queue.songs[0].duration * 1000) return message.reply("You can't fast forward past the song's end");
  queue.resource.playbackDuration += Number(args[0])*1000;
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

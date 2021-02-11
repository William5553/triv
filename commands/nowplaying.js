const { MessageEmbed } = require('discord.js');

exports.run = (client, message) => {
  const queue = client.queue.get(message.guild.id);
  if (!queue || !queue.connection || !queue.connection.dispatcher) return message.reply('there is nothing playing.').catch(client.logger.error);
  const song = queue.songs[0],
    seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000,
    left = song.duration - seek;

  const bar = createBar(song.duration == 0 ? seek : song.duration, seek, 20);
  const nowPlaying = new MessageEmbed()
    .setTitle(song.title)
    .setURL(song.url)
    .setColor('RED')
    .setDescription(`**${Math.floor(bar[1] * 100) / 100}% done**\n${getTime(seek)} [${bar[0]}] ${song.duration == 0 ? ' ◉ LIVE' : getTime(song.duration)}`);

  if (song.duration > 0)
    nowPlaying.setFooter(`Time Remaining: ${getTime(left)}`);

  return message.channel.send(nowPlaying);
};

function getTime(time) {
  return new Date(time * 1000).toISOString().substr(11, 8);
}

function createBar(total, current, size = 40, line = '▬', slider = '🔘') {
  if (!total) throw new Error('Total value is either not provided or invalid');
  if (!current) throw new Error('Current value is either not provided or invalid');
  if (isNaN(total)) throw new Error('Total value is not an integer');
  if (isNaN(current)) throw new Error('Current value is not an integer');
  if (isNaN(size)) throw new Error('Size is not an integer');
  if (current > total) {
    const bar = line.repeat(size + 2);
    const percentage = current / total * 100;
    return [bar, percentage];
  } else {
    const percentage = current / total;
    const progress = Math.round(size * percentage);
    const emptyProgress = size - progress;
    const progressText = line.repeat(progress).replace(/.$/, slider);
    const emptyProgressText = line.repeat(emptyProgress);
    const bar = progressText + emptyProgressText;
    const calculated = percentage * 100;
    return [bar, calculated];
  }
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['np'],
  permLevel: 0
};

exports.help = {
  name: 'nowplaying',
  description: 'Shows the song that is currently playing',
  usage: 'nowplaying'
};

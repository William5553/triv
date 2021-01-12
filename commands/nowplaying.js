const createBar = require('string-progressbar'),
  { MessageEmbed } = require('discord.js');

exports.run = (client, message) => {
  const queue = client.queue.get(message.guild.id);
  if (!queue || !queue.connection || !queue.connection.dispatcher) return message.reply('there is nothing playing.').catch(client.logger.error);
  const song = queue.songs[0],
    seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000,
    left = song.duration - seek;

  const nowPlaying = new MessageEmbed()
    .setTitle(song.title)
    .setURL(song.url)
    .setColor('RED')
    .setDescription(`${getTime(seek)} [${createBar(song.duration == 0 ? seek : song.duration, seek, 20)[0]}] ${song.duration == 0 ? ' ◉ LIVE' : getTime(song.duration)}`);

  if (song.duration > 0)
    nowPlaying.setFooter(`Time Remaining: ${getTime(left)}`);

  return message.channel.send(nowPlaying);
};

function getTime(time) {
  return new Date(time * 1000).toISOString().substr(11, 8);
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

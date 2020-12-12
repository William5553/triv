const createBar = require('string-progressbar'),
  { MessageEmbed } = require('discord.js');

exports.run = (client, message) => {
  const queue = client.queue.get(message.guild.id);
  if (!queue || !queue.connection || !queue.connection.dispatcher) return message.reply('there is nothing playing.').catch(client.logger.error);
  const song = queue.songs[0],
    seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000,
    left = song.duration - seek;

  const nowPlaying = new MessageEmbed()
    .setTitle('Now playing')
    .setDescription(`${song.title}\n${song.url}`)
    .setColor('#F8AA2A')
    .setAuthor(client.user.username)
    .addField(
      '\u200b',
      new Date(seek * 1000).toISOString().substr(11, 8) +
        '[' +
        createBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
        ']' +
        (song.duration == 0 ? ' ◉ LIVE' : new Date(song.duration * 1000).toISOString().substr(11, 8)),
      false
    );

  if (song.duration > 0) nowPlaying.setFooter('Time Remaining: ' + new Date(left * 1000).toISOString().substr(11, 8));

  return message.channel.send(nowPlaying);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['np'],
  permLevel: 0,
};

exports.help = {
  name: 'nowplaying',
  description: 'Shows the song that is currently playing',
  usage: 'nowplaying',
};

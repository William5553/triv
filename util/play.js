const ytdl = require('discord-ytdl-core');
const { canModifyQueue } = require('./queue');

const filters = {
  bassboost: 'bass=g=20,dynaudnorm=f=200',
  '8D': 'apulsator=hz=0.08',
  vaporwave: 'aresample=48000,asetrate=48000*0.8',
  nightcore: 'aresample=48000,asetrate=48000*1.25',
  phaser: 'aphaser=in_gain=0.4',
  tremolo: 'tremolo',
  vibrato: 'vibrato=f=6.5',
  reverse: 'areverse',
  treble: 'treble=g=5',
  normalizer: 'dynaudnorm=f=200',
  surround: 'surround',
  pulsator: 'apulsator=hz=1',
  subboost: 'asubboost',
  karaoke: 'stereotools=mlev=0.03',
  flanger: 'flanger',
  gate: 'agate',
  haas: 'haas',
  mcompand: 'mcompand'
};

module.exports = {
  async play(song, message, updFilter) {
    const { client } = message;
    const queue = client.queue.get(message.guild.id);
    const seekTime = updFilter ? queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime + queue.additionalStreamTime : undefined;
    if (!song) {
      queue.channel.leave();
      client.queue.delete(message.guild.id);
      return queue.textChannel.send('🚫 Music queue ended.').catch(client.logger.error);
    }
    const encoderArgsFilters = [];
    Object.keys(queue.filters).forEach((filterName) => {
      if (queue.filters[filterName]) {
        encoderArgsFilters.push(filters[filterName]);
      }
    });
    let encoderArgs;
    if (encoderArgsFilters.length < 1) {
      encoderArgs = [];
    } else {
      encoderArgs = ['-af', encoderArgsFilters.join(',')];
    }

    try {
      queue.stream = await ytdl(song.url, {
        filter: 'audioonly',
        encoderArgs,
        highWaterMark: 1 << 25,
        seek: seekTime / 1000,
        opusEncoded: true
      });     
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }
      client.logger.error(error);
      return message.channel.send(`Error: ${error.message ? error.message : error}`);
    }

    queue.connection.on('disconnect', () => client.queue.delete(message.guild.id));

    const dispatcher = queue.connection
      .play(queue.stream, {
        type: 'opus',
        bitrate: 'auto'
      })
      .on('finish', () => {
        if (collector && !collector.ended) collector.stop();
        queue.additionalStreamTime = 0;
        if (queue.loop) {
          // if loop is on, push the song back at the end of the queue
          // so it can repeat endlessly
          const lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.play(queue.songs[0], message);
        } else {
          // Recursively play the next song
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        }
      })
      .on('error', err => {
        client.logger.error(err);
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      });
    if (seekTime) {
      queue.additionalStreamTime = seekTime;
    }
    dispatcher.setVolumeLogarithmic(queue.volume / 100);

    try {
      var playingMessage = await queue.textChannel.send(`🎶 Started playing: **${song.title}** ${song.url}`);
      await playingMessage.react('⏭');
      await playingMessage.react('⏯');
      await playingMessage.react('🔇');
      await playingMessage.react('🔉');
      await playingMessage.react('🔊');
      await playingMessage.react('🔁');
      await playingMessage.react('⏹');
    } catch (error) {
      client.logger.error(error);
    }

    const filter = (reaction, user) => user.id !== client.user.id;
    var collector = playingMessage.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000,
    });

    collector.on('collect', (reaction, user) => {
      if (!queue) return;
      const member = message.guild.member(user);
      if (!canModifyQueue(member)) return;
      reaction.users.remove(user).catch(client.logger.error);
      switch (reaction.emoji.name) {
        case '⏭':
          queue.playing = true;
          queue.connection.dispatcher.end();
          queue.textChannel.send(`${user} ⏩ skipped the song`).catch(client.logger.error);
          collector.stop();
          break;

        case '⏯':
          if (queue.playing) {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.pause(true);
            queue.textChannel.send(`${user} ⏸ paused the music.`).catch(client.logger.error);
          } else {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.resume();
            queue.textChannel.send(`${user} ▶ resumed the music!`).catch(client.logger.error);
          }
          break;

        case '🔇':
          if (queue.volume <= 0) {
            queue.volume = 100;
            queue.connection.dispatcher.setVolumeLogarithmic(100 / 100);
            queue.textChannel.send(`${user} 🔊 unmuted the music!`).catch(client.logger.error);
          } else {
            queue.volume = 0;
            queue.connection.dispatcher.setVolumeLogarithmic(0);
            queue.textChannel.send(`${user} 🔇 muted the music!`).catch(client.logger.error);
          }
          break;

        case '🔉':
          if (queue.volume === 0) return;
          if (queue.volume - 10 <= 0) queue.volume = 0;
          else queue.volume = queue.volume - 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          queue.textChannel
            .send(`${user} 🔉 decreased the volume, the volume is now ${queue.volume}%`)
            .catch(message.client.logger.error);
          break;

        case '🔊':
          if (queue.volume === 100) return;
          if (queue.volume + 10 >= 100) queue.volume = 100;
          else queue.volume = queue.volume + 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          queue.textChannel
            .send(`${user} 🔊 increased the volume, the volume is now ${queue.volume}%`)
            .catch(client.logger.error);
          break;

        case '🔁':
          queue.loop = !queue.loop;
          queue.textChannel.send(`${user} has ${queue.loop ? '**enabled**' : '**disabled**'} loop`).catch(client.logger.error);
          break;

        case '⏹':
          queue.songs = [];
          queue.textChannel.send(`${user} ⏹ stopped the music!`).catch(client.logger.error);
          try {
            queue.connection.dispatcher.end();
          } catch (error) {
            client.logger.error(error);
            queue.connection.disconnect();
          }
          collector.stop();
          break;

        default:
          break;
      }
    });

    collector.on('end', () => {
      if (playingMessage) playingMessage.reactions.removeAll().catch(client.logger.error);
    });
  }
};

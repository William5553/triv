const ytdl = require('discord-ytdl-core');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { canModifyQueue, formatDate } = require('./Util');
const { createAudioPlayer, createAudioResource, entersState, AudioPlayerStatus, getVoiceConnection } = require('@discordjs/voice');

require('moment-duration-format');

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
  mcompand: 'mcompand',
  earwax: 'earwax'
};

module.exports = {
  async play(song, message, updFilter) {
    const { client } = message;
    const queue = client.queue.get(message.guild.id);
    const seekTime = updFilter ? queue.resource.playbackDuration + queue.additionalStreamTime : 0;
    if (!song) {
      queue.player.stop();
      queue.connection.destroy();
      client.queue.delete(message.guild.id);
      return queue.textChannel.send('🚫 Music queue ended.');
    }
    const encoderArgsFilters = [];
    Object.keys(queue.filters).forEach(filterName => {
      if (queue.filters[filterName])
        encoderArgsFilters.push(filters[filterName]);
    });
    let encoderArgs;
    encoderArgsFilters.length < 1 ? encoderArgs = [] : encoderArgs = ['-af', encoderArgsFilters.join(',')];

    let stream;
    try {
      if (queue.stream) await queue.stream.destroy();
      stream = await ytdl(song.url, {
        filter: 'audioonly',
        encoderArgs,
        highWaterMark: 1 << 25,
        seek: seekTime / 1000,
        opusEncoded: true,
        dlChunkSize: 0
      });
      queue.stream = stream;
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message, false);
      }
      client.logger.error(error.stack ? error.stack : error);
      return message.channel.send(`Error: ${error.message || error}`);
    }

    

    if (!queue.player) {
      queue.player = createAudioPlayer();
      queue.player.on('error', error => {
        client.logger.error(`${error.stack || error} with resource ${error.resource.metadata.title}`);
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      });
      queue.player.on(AudioPlayerStatus.Idle, () => {
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
      });
    }
    const resource = createAudioResource(stream, { inlineVolume: true });
    resource.volume.setVolume(queue.volume / 100);
    queue.resource = resource;
    queue.player.play(resource);
    try {
      await entersState(queue.player, AudioPlayerStatus.Playing, 5e3);
      queue.connection?.subscribe(queue.player);
    } catch (error) {
      queue.textChannel.send(`An error occurred while trying to play **${song.title}**: ${error.message || error}`);
      client.logger.error(`Error occurred while trying to play music: ${error.stack || error}`);
    }

    if (seekTime) 
      queue.additionalStreamTime = seekTime;
    
    let playingMessage;
    try {
      playingMessage = await queue.textChannel.send({embeds: [
        new MessageEmbed()
          .setTitle(song.title)
          .setURL(song.url)
          .setColor('#FF0000')
          .setThumbnail(song.thumbnail.url)
          .setDescription(`${seekTime >= 1 ? `Starting at ${new Date(seekTime).toISOString().substr(11, 8)}` : ''}`)
          .setAuthor(song.channel.name, song.channel.profile_pic, song.channel.url)
          .setFooter(`Length: ${song.duration <= 0 ? '◉ LIVE' : moment.duration(song.duration * 1000).format('hh:mm:ss')} | Published on ${formatDate(song.publishDate)}`)
      ]});
      await playingMessage.react('⏭');
      await playingMessage.react('⏯');
      await playingMessage.react('🔇');
      await playingMessage.react('🔉');
      await playingMessage.react('🔊');
      await playingMessage.react('🔁');
      await playingMessage.react('⏹');
      await playingMessage.react('🎤');
    } catch (error) {
      client.logger.error(error.stack || error);
    }

    const filter = (reaction, user) => user.id !== client.user.id;
    const collector = playingMessage.createReactionCollector(filter, { time: song.duration > 0 ? song.duration * 1000 : 600000 });

    collector.on('collect', (reaction, user) => {
      reaction.users.remove(user);
      if (!queue) return;
      const member = message.guild.members.cache.get(user.id);
      if (canModifyQueue(member) != true) return;
      switch (reaction.emoji.name) {
        case '⏭':
          queue.playing = true;
          queue.player.stop();
          queue.textChannel.send(`${user} ⏩ skipped the song`);
          collector.stop();
          break;

        case '⏯':
          if (queue.playing) {
            queue.player.pause();
            queue.textChannel.send(`${user} ⏸ paused the music.`);
          } else {
            queue.player.unpause();
            queue.textChannel.send(`${user} ▶ resumed the music!`);
          }
          queue.playing = !queue.playing;
          break;

        case '🔇':
          if (queue.volume <= 0) {
            queue.volume = 100;
            resource.volume.setVolume(1);
            queue.textChannel.send(`${user} 🔊 unmuted the music!`);
          } else {
            queue.volume = 0;
            resource.volume.setVolume(0);
            queue.textChannel.send(`${user} 🔇 muted the music!`);
          }
          break;

        case '🔉':
          if (queue.volume === 0) return;
          if (queue.volume - 10 <= 0)
            queue.volume = 0;
          else
            queue.volume = queue.volume - 10;
          resource.volume.setVolume(queue.volume / 100);
          queue.textChannel.send(`${user} 🔉 decreased the volume, the volume is now ${queue.volume}%`);
          break;

        case '🔊':
          if (queue.volume === 100) return;
          if (queue.volume + 10 >= 100)
            queue.volume = 100;
          else
            queue.volume = queue.volume + 10;
          resource.volume.setVolume(queue.volume / 100);
          queue.textChannel.send(`${user} 🔊 increased the volume, the volume is now ${queue.volume}%`);
          break;

        case '🔁':
          queue.loop = !queue.loop;
          queue.textChannel.send(`${user} has ${queue.loop ? '**enabled**' : '**disabled**'} loop`);
          break;

        case '⏹':
          queue.textChannel.send(`${user} ⏹ stopped the music!`);
          if (queue.stream) queue.stream.destroy();
          queue.player.stop();
          getVoiceConnection(message.guild.id).destroy();
          collector.stop();
          client.queue.delete(message.guild.id);
          break;
          
        case '🎤':
          reaction.users.remove(client.user);
          client.commands.get('lyrics').run(client, message);
          break;

        default:
          break;
      }
    });

    collector.on('end', () => {
      if (playingMessage) playingMessage.reactions.removeAll();
    });
  }
};

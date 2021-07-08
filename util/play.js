const { MessageEmbed, MessageButton } = require('discord.js');
const moment = require('moment');
const { canModifyQueue, formatDate } = require('./Util');
const { createAudioPlayer, createAudioResource, entersState, getVoiceConnection, AudioPlayerStatus, NoSubscriberBehavior } = require('@discordjs/voice');
const { raw } = require('youtube-dl-exec');
// const { FFmpeg } = require('prism-media');

require('moment-duration-format');

// TODO: make play support other sites with ytdl

const filters = {
  bassboost: 'bass=g=20,dynaudnorm=f=200',
  '8d': 'apulsator=hz=0.08',
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
  async play(song, message, updFilter = false) {
    const { client } = message;
    const queue = client.queue.get(message.guild.id);
    const seekTime = updFilter ? moment.duration(queue.resource.playbackDuration + queue.additionalStreamTime).format('hh:mm:ss') : '00:00:00';
    if (!song) {
      queue.player.stop();
      queue.connection?.destroy();
      client.queue.delete(message.guild.id);
      return queue.textChannel.send('🚫 Music queue ended.');
    }
    if (typeof song !== 'object') {
      queue.songs.shift();
      return module.exports.play(queue.songs[0], message);
    }
    const encoderArgsFilters = [];
    Object.keys(queue.filters).forEach(filterName => {
      if (queue.filters[filterName])
        encoderArgsFilters.push(filters[filterName]);
    });
    let encoderArgs;
    encoderArgsFilters.length < 1 ? encoderArgs = '' : encoderArgs = encoderArgsFilters.join(',');

    queue.resource = await _createAudioResource(song.url, seekTime, encoderArgs);
    queue.resource.volume.setVolume(queue.volume / 100);
    
    if (!queue.player) {
      queue.player = createAudioPlayer({ noSubscriber: NoSubscriberBehavior.Stop });
      queue.player.on('error', error => {
        client.logger.error(`A queue audio player encountered an error: ${error.stack || error}`);
        queue.textChannel.send({embeds: [
          new MessageEmbed()
            .setColor('#FF0000')
            .setTimestamp()
            .setTitle('Please report this on GitHub')
            .setURL('https://github.com/william5553/triv/issues')
            .setDescription(`**The audio player encountered an error.\nStack Trace:**\n\`\`\`${error.stack || error}\`\`\``)
            .addField('**Command:**', message.content)
        ]});
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      });
      await queue.player.play(queue.resource);
      /*queue.player.on(AudioPlayerStatus.Idle, () => {
        client.logger.warn(`idle\n${JSON.stringify(song)}`);
        if (queue.collector && !queue.collector?.ended) queue.collector?.stop();
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
      });*/
    } else 
      queue.player.play(queue.resource);
    queue.connection.subscribe(queue.player);
    try {
      await entersState(queue.player, AudioPlayerStatus.Playing, 5e3);
    } catch (error) {
      queue.textChannel.send(`An error occurred while trying to play **${song.title}**: ${error.message || error}`);
      client.logger.error(`Error occurred while trying to play music in ${message.guild.name}: ${error.stack || error}`);
      queue.connection?.destroy();
      queue.collector?.stop();
      client.queue.delete(message.guild.id);
    }

    if (seekTime) 
      queue.additionalStreamTime = seekTime;

    const playingMessage = await queue.textChannel.send({embeds: [
      new MessageEmbed()
        .setTitle(song.title)
        .setURL(song.url)
        .setColor('#FF0000')
        .setThumbnail(song.thumbnail.url)
        .setDescription(`${seekTime.replace(':', '') >= 1 ? `Starting at ${seekTime}` : ''}`)
        .setAuthor(song.channel.name, song.channel.profile_pic, song.channel.url)
        .setFooter(`Length: ${song.duration <= 0 ? '◉ LIVE' : moment.duration(song.duration, 'seconds').format('hh:mm:ss', { trim: false })} | Published on ${formatDate(song.publishDate)}`)
    ], components: [[
      new MessageButton().setLabel('SKIP').setCustomId('skip').setStyle('PRIMARY'),
      new MessageButton().setLabel('PAUSE').setCustomId('pause').setStyle('PRIMARY'),
      new MessageButton().setLabel('LOOP').setCustomId('loop').setStyle('PRIMARY'),
      new MessageButton().setLabel('STOP').setCustomId('stop').setStyle('DANGER'),
      new MessageButton().setLabel('LYRICS').setCustomId('lyrics').setStyle('PRIMARY')
    ], [
      new MessageButton().setLabel('MUTE').setCustomId('mute').setStyle('PRIMARY'),
      new MessageButton().setEmoji('🔉').setCustomId('voldown').setStyle('PRIMARY'),
      new MessageButton().setEmoji('🔊').setCustomId('volup').setStyle('PRIMARY')
    ]]});

    queue.collector = playingMessage.createMessageComponentCollector();

    queue.collector.on('collect', interaction => {
      if (!queue) return;
      const member = message.guild.members.cache.get(interaction.user.id);
      const modifiable = canModifyQueue(member);
      if (modifiable != true) return interaction.reply({ content: modifiable, ephemeral: true });
      // TODO: if you can't make the vol higher or lower, disable the button
      switch (interaction.customId) {
        case 'skip':
          queue.playing = true;
          queue.player.stop();
          interaction.reply(`${interaction.user} ⏩ skipped the song`);
          queue.collector.stop();
          break;

        case 'pause':
          if (queue.playing) {
            queue.player.pause();
            queue.textChannel.send(`${interaction.user} ⏸ paused the music.`);
            interaction.update({ components: [ playingMessage.components[0].spliceComponents(1, 1, [new MessageButton().setLabel('UNPAUSE').setCustomId('pause').setStyle('PRIMARY')]), playingMessage.components[1] ] });
          } else {
            queue.player.unpause();
            queue.textChannel.send(`${interaction.user} ▶ resumed the music!`);
            interaction.update({ components: [ playingMessage.components[0].spliceComponents(1, 1, [new MessageButton().setLabel('PAUSE').setCustomId('pause').setStyle('PRIMARY')]), playingMessage.components[1] ] });
          }
          queue.playing = !queue.playing;
          break;

        case 'mute':
          if (queue.volume <= 0) {
            queue.volume = 100;
            queue.resource.volume.setVolume(1);
            queue.textChannel.send(`${interaction.user} 🔊 unmuted the music!`);
            interaction.update({ components: [ playingMessage.components[0], playingMessage.components[1].spliceComponents(0, 1, [new MessageButton().setLabel('MUTE').setCustomId('mute').setStyle('PRIMARY')]) ] });
          } else {
            queue.volume = 0;
            queue.resource.volume.setVolume(0);
            queue.textChannel.send(`${interaction.user} 🔇 muted the music!`);
            interaction.update({ components: [ playingMessage.components[0], playingMessage.components[1].spliceComponents(0, 1, [new MessageButton().setLabel('UNMUTE').setCustomId('mute').setStyle('PRIMARY')]) ] });
          }
          break;

        case 'voldown':
          if (queue.volume === 0) return;
          if (queue.volume - 10 <= 0)
            queue.volume = 0;
          else
            queue.volume = queue.volume - 10;
          queue.resource.volume.setVolume(queue.volume / 100);
          interaction.reply(`${interaction.user} 🔉 decreased the volume, the volume is now ${queue.volume}%`);
          break;

        case 'volup':
          if (queue.volume === 100) return;
          if (queue.volume + 10 >= 100)
            queue.volume = 100;
          else
            queue.volume = queue.volume + 10;
          queue.resource.volume.setVolume(queue.volume / 100);
          interaction.reply(`${interaction.user} 🔊 increased the volume, the volume is now ${queue.volume}%`);
          break;

        case 'loop':
          queue.loop = !queue.loop;
          interaction.reply(`${interaction.user} has ${queue.loop ? '**enabled**' : '**disabled**'} loop`);
          break;

        case 'stop':
          interaction.reply(`${interaction.user} ⏹ stopped the music!`);
          queue.player.stop();
          if (queue.stream) queue.stream.destroy();
          if (getVoiceConnection(message.guild.id)) getVoiceConnection(message.guild.id).destroy();
          queue.collector.stop();
          client.queue.delete(message.guild.id);
          break;
          
        case 'lyrics':
          interaction.update({ components: [ playingMessage.components[0].spliceComponents(4, 1), playingMessage.components[1] ] });
          client.commands.get('lyrics').run(client, message);
          break;

        default:
          break;
      }
    });

    queue.collector.on('end', () => playingMessage?.edit({ components: [] }));
  }
};

const _createAudioResource = (url/*, seek = '00:00:00', filters = ''*/) => {
  return new Promise((resolve, reject) => {
    const rawStream = raw(url, {
      preferFreeFormats: true,
      noCallHome: true,
      noCheckCertificate: true,
      youtubeSkipDashManifest: true,
      //defaultSearch: 'ytsearch',
      o: '-',
      q: '',
      f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
      r: '100K'
    }, { stdio: ['ignore', 'pipe', 'ignore'] });
    if (!rawStream.stdout) {
      reject(new Error('No stdout'));
      return;
    }
    /*const FFMPEG_ARGUMENTS = [
      '-analyzeduration', '0',
      '-loglevel', '0',
      //'-f', 's16le',
      '-acodec', 'libopus',
      '-f', 'opus',
      '-ar', '48000',
      '-ac', '2'
    ];
  
    if (filters) FFMPEG_ARGUMENTS.push('-af', filters.join(','));
    const stream = new FFmpeg({
      args: ['-ss', seek, '-i', rawStream.stdout, ...FFMPEG_ARGUMENTS]
    });
  
    resolve(createAudioResource(stream, { inlineVolume: true }));*/
    resolve(createAudioResource(rawStream.stdout, { inlineVolume: true }));
  });
};
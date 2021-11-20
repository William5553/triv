const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const moment = require('moment');
const { canModifyQueue, formatDate, validUrl } = require('./Util');
const { createAudioPlayer, createAudioResource, entersState, getVoiceConnection, AudioPlayerStatus, NoSubscriberBehavior } = require('@discordjs/voice');
const { exec } = require('youtube-dl-exec');
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
    for (const filterName of Object.keys(queue.filters)) {
      if (queue.filters[filterName])
        encoderArgsFilters.push(filters[filterName]);
    }
    let encoderArgs;
    encoderArgsFilters.length === 0 ? encoderArgs = '' : encoderArgs = encoderArgsFilters.join(',');

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
      queue.player.on(AudioPlayerStatus.Idle, () => {
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
      });
    } else 
      queue.player.play(queue.resource);
    queue.connection.subscribe(queue.player);
    try {
      await entersState(queue.player, AudioPlayerStatus.Playing, 5e3);
    } catch (error) {
      queue.textChannel.send(`An error occurred while trying to play **${song.title ? song.title : song.url}**: ${error.message || error}`);
      client.logger.error(`Error occurred while trying to play music in ${message.guild.name}: ${error.stack || error}`);
      queue.connection?.destroy();
      queue.collector?.stop();
      client.queue.delete(message.guild.id);
    }

    if (seekTime) 
      queue.additionalStreamTime = seekTime;

    const embed = new MessageEmbed()
      .setTitle(song.title ? song.title : song.url)
      .setColor('#FF0000')
      .setDescription(seekTime.replace(':', '') >= 1 ? `Starting at ${seekTime}` : '');

    if (song.channel)
      embed.setAuthor(song.channel?.name, song.channel?.profile_pic, song.channel?.url);
    if (song.thumbnail)
      embed.setThumbnail(song.thumbnail.url);
    if (song.duration != undefined && song.publishDate)
      embed.setFooter(`Length: ${song?.duration <= 0 ? '◉ LIVE' : moment.duration(song?.duration, 'seconds').format('hh:mm:ss', { trim: false })} | Published on ${formatDate(song?.publishDate)}`);
    if (validUrl(song.url))
      embed.setURL(song.url);

    const playingMessage = await queue.textChannel.send({
      embeds: [ embed ],
      components: [
        new MessageActionRow({components: [
          new MessageButton({ label: 'SKIP', customId: 'skip', style: 'PRIMARY' }),
          new MessageButton({ label: 'PAUSE', customId: 'pause', style: 'PRIMARY' }),
          new MessageButton({ label: 'LOOP', customId: 'loop', style: 'PRIMARY' }),
          new MessageButton({ label: 'STOP', customId: 'stop', style: 'DANGER' }),
          new MessageButton({ label: 'LYRICS', customId: 'lyrics', style: 'PRIMARY' })
        ]}),
        new MessageActionRow({components: [
          new MessageButton({ label: 'MUTE', customId: 'mute', style: 'PRIMARY' }),
          new MessageButton({ emoji: '🔉', customId: 'voldown', style: 'PRIMARY' }),
          new MessageButton({ emoji: '🔊', customId: 'volup', style: 'PRIMARY', disabled: true })
        ]})]
    });

    queue.collector = playingMessage.createMessageComponentCollector();

    queue.collector.on('collect', interaction => {
      if (!queue) return;
      const member = message.guild.members.cache.get(interaction.user.id);
      const modifiable = canModifyQueue(member);
      if (modifiable != true) return interaction.reply({ content: modifiable, ephemeral: true });
      // TODO: if you can't make the vol higher or lower, disable the button
      let reply = true, reply2 = true;
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
            interaction.update({ components: [ playingMessage.components[0].spliceComponents(1, 1, [ new MessageButton({ label: 'UNPAUSE', customId: 'pause', style: 'PRIMARY' }) ]), playingMessage.components[1] ] });
          } else {
            queue.player.unpause();
            queue.textChannel.send(`${interaction.user} ▶ resumed the music!`);
            interaction.update({ components: [ playingMessage.components[0].spliceComponents(1, 1, [ new MessageButton({ label: 'PAUSE', customId: 'pause', style: 'PRIMARY' }) ]), playingMessage.components[1] ] });
          }
          queue.playing = !queue.playing;
          break;

        case 'mute':
          if (queue.volume <= 0) {
            queue.volume = 100;
            queue.resource.volume.setVolume(1);
            queue.textChannel.send(`${interaction.user} 🔊 unmuted the music!`);
            interaction.update({ components: [ playingMessage.components[0], new MessageActionRow({ components: [ new MessageButton({ label: 'MUTE', customId: 'mute', style: 'PRIMARY' }), new MessageButton({ emoji: '🔉', customId: 'voldown', style: 'PRIMARY', disabled: false }), new MessageButton({ emoji: '🔊', customId: 'volup', style: 'PRIMARY', disabled: true }) ] }) ] });
          } else {
            queue.volume = 0;
            queue.resource.volume.setVolume(0);
            queue.textChannel.send(`${interaction.user} 🔇 muted the music!`);
            interaction.update({ components: [ playingMessage.components[0], new MessageActionRow({ components: [ new MessageButton({ label: 'UNMUTE', customId: 'mute', style: 'PRIMARY' }), new MessageButton({ emoji: '🔉', customId: 'voldown', style: 'PRIMARY', disabled: true }), new MessageButton({ emoji: '🔊', customId: 'volup', style: 'PRIMARY', disabled: false }) ] }) ] });
          }
          break;

        case 'voldown':
          if (queue.volume === 100)
            reply = false;
          if (queue.volume - 10 <= 0) {
            queue.volume = 0;
            reply2 = false;
          } else
            queue.volume = queue.volume - 10;
          queue.resource.volume.setVolume(queue.volume / 100);
          if (reply && reply2)
            interaction.reply(`${interaction.user} 🔉 decreased the volume, the volume is now ${queue.volume}%`);
          else if (!reply) {
            interaction.update({ components: [ playingMessage.components[0], playingMessage.components[1].spliceComponents(2, 1, [ new MessageButton({ emoji: '🔊', customId: 'volup', style: 'PRIMARY', disabled: false }) ]) ] });
            queue.textChannel.send(`${interaction.user} 🔊 decreased the volume, the volume is now 90%`);
          } else if (!reply2) {
            interaction.update({ components: [ playingMessage.components[0], new MessageActionRow({ components: [ new MessageButton({ label: 'UNMUTE', customId: 'mute', style: 'PRIMARY' }), new MessageButton({ emoji: '🔉', customId: 'voldown', style: 'PRIMARY', disabled: true }), new MessageButton({ emoji: '🔊', customId: 'volup', style: 'PRIMARY', disabled: false }) ] }) ] });
            queue.textChannel.send(`${interaction.user} 🔉 decreased the volume, the volume is now 0%`);
          }
          break;

        case 'volup':
          if (queue.volume === 0)
            reply = false;
          if (queue.volume + 10 >= 100) {
            queue.volume = 100;
            reply2 = false;
          } else
            queue.volume = queue.volume + 10;
          queue.resource.volume.setVolume(queue.volume / 100);
          if (reply && reply2)
            interaction.reply(`${interaction.user} 🔊 increased the volume, the volume is now ${queue.volume}%`);
          else if (!reply) {
            interaction.update({ components: [ playingMessage.components[0], new MessageActionRow({ components: [ new MessageButton({ label: 'MUTE', customId: 'mute', style: 'PRIMARY' }), new MessageButton({ emoji: '🔉', customId: 'voldown', style: 'PRIMARY', disabled: false }), new MessageButton({ emoji: '🔊', customId: 'volup', style: 'PRIMARY', disabled: false }) ] }) ] });
            queue.textChannel.send(`${interaction.user} 🔊 increased the volume, the volume is now 10%`);
          } else if (!reply2) {
            interaction.update({ components: [ playingMessage.components[0], new MessageActionRow({ components: [ new MessageButton({ label: 'MUTE', customId: 'mute', style: 'PRIMARY' }), new MessageButton({ emoji: '🔉', customId: 'voldown', style: 'PRIMARY', disabled: false }), new MessageButton({ emoji: '🔊', customId: 'volup', style: 'PRIMARY', disabled: true }) ] }) ] });
            queue.textChannel.send(`${interaction.user} 🔊 increased the volume, the volume is now 100%`);
          }
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
    const rawStream = exec(url, {
      preferFreeFormats: true,
      noCallHome: true,
      noCheckCertificate: true,
      youtubeSkipDashManifest: true,
      defaultSearch: 'ytsearch',
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

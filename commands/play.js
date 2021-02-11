const { play } = require('../util/play'),
  ytdl = require('ytdl-core'),
  YouTubeAPI = require('simple-youtube-api');

exports.run = async (client, message, args) => {
  if (!client.settings.google_api_key) return message.reply('the bot owner has not set up this command yet');
  const { channel } = message.member.voice,
    serverQueue = client.queue.get(message.guild.id),
    youtube = new YouTubeAPI(client.settings.google_api_key);
  if (!channel) return message.reply('you need to join a voice channel first!').catch(client.logger.error);
  if (serverQueue && channel !== message.guild.me.voice.channel)
    return message.reply(`you must be in the same channel as ${client.user}`).catch(client.logger.error);

  if (!args.length)
    return message.reply(`${client.settings.prefix}${exports.help.usage}`).catch(client.logger.error);

  const permissions = channel.permissionsFor(client.user);
  if (!permissions.has('CONNECT'))
    return message.reply('cannot connect to voice channel, missing the **CONNECT** permission');
  if (!permissions.has('SPEAK'))
    return message.reply('I cannot speak in this voice channel, make sure I have the **SPEAK** permission!');

  const search = args.join(' ');
  const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
  const playlistPattern = /^.*(list=)([^#&?]*).*/gi;
  const url = args[0];
  const urlValid = videoPattern.test(args[0]);

  // Start the playlist if playlist url was provided
  if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
    return client.commands.get('playlist').run(client, message, args);
  }

  const queueConstruct = {
    textChannel: message.channel,
    channel,
    connection: null,
    songs: [],
    loop: false,
    volume: 100,
    playing: true,
    additionalStreamTime: 0,
    filters: {
      bassboost: false,
      '8D': false,
      vaporwave: false,
      nightcore: false,
      phaser: false,
      tremolo: false,
      vibrato: false,
      reverse: false,
      treble: false,
      normalizer: false,
      surround: false,
      pulsator: false,
      subboost: false,
      karaoke: false,
      flanger: false,
      gate: false,
      haas: false,
      mcompand: false
    }
  };

  let songInfo, song;

  if (urlValid) {
    try {
      songInfo = await ytdl.getInfo(url);
      song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        duration: songInfo.videoDetails.lengthSeconds,
        thumbnail: songInfo.videoDetails.thumbnails[songInfo.videoDetails.thumbnails.length - 1],
        channel: songInfo.videoDetails.author,
        publishDate: songInfo.videoDetails.publishDate
      };
    } catch (error) {
      client.logger.error(error.stack ? error.stack : error);
      return message.reply(error.message).catch(client.logger.error);
    }
  } else {
    try {
      const results = await youtube.searchVideos(search, 1);
      songInfo = await ytdl.getInfo(results[0].url);
      song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        duration: songInfo.videoDetails.lengthSeconds,
        thumbnail: songInfo.videoDetails.thumbnails[songInfo.videoDetails.thumbnails.length - 1],
        channel: songInfo.videoDetails.author,
        publishDate: songInfo.videoDetails.publishDate
      };
    } catch (error) {
      client.logger.error(error.stack ? error.stack : error);
      return message.reply(error.message).catch(client.logger.error);
    }
  }

  if (serverQueue) {
    serverQueue.songs.push(song);
    return serverQueue.textChannel
      .send(`✅ **${song.title}** has been added to the queue by ${message.author}`)
      .catch(client.logger.error);
  }

  queueConstruct.songs.push(song);
  client.queue.set(message.guild.id, queueConstruct);

  try {
    queueConstruct.connection = await channel.join();
    await queueConstruct.connection.voice.setSelfDeaf(true);
    play(queueConstruct.songs[0], message, false);
  } catch (error) {
    client.logger.error(error);
    client.queue.delete(message.guild.id);
    await channel.leave();
    return message.channel.send(`could not join the channel: ${error}`).catch(client.logger.error);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'play',
  description: 'Plays audio from YouTube',
  usage: 'play [YouTube URL | Video Name]'
};

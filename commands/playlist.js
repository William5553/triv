const MAX_VIDEOS = 50,
  { MessageEmbed } = require('discord.js'),
  ytdl = require("ytdl-core"),
  YouTubeAPI = require('simple-youtube-api'),
  { play } = require('../util/play');

exports.run = async (client, message, args) => {
  const { channel } = message.member.voice,
    youtube = new YouTubeAPI(client.settings.google_api_key),
    serverQueue = client.queue.get(message.guild.id);
  if (serverQueue && channel !== message.guild.me.voice.channel)
    return message.reply(`You must be in the same channel as ${client.user}`).catch(client.logger.error);
  if (!args.length)
    return message
      .reply(`${client.settings.prefix}${exports.help.usage}`)
      .catch(client.logger.error);
  if (!channel) return message.reply('you need to join a voice channel first!').catch(client.logger.error);

  const permissions = channel.permissionsFor(client.user);
  if (!permissions.has('CONNECT'))
    return message.reply('cannot connect to voice channel, missing **CONNECT** permission');
  if (!permissions.has('SPEAK'))
    return message.reply('I cannot speak in this voice channel, make sure I have the **SPEAK** permission');

  const search = args.join(' '),
    pattern = /^.*(youtu.be\/|list=)([^#&?]*).*/gi,
    url = args[0],
    urlValid = pattern.test(args[0]);

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

  let playlist = null,
    videos = [];

  const m = await message.channel.send('Give me a minute...');
  
  if (urlValid) {
    try {
      playlist = await youtube.getPlaylist(url, { part: 'snippet' });
      videos = await playlist.getVideos(MAX_VIDEOS, { part: 'snippet' });
    } catch (error) {
      client.logger.error(error);
      return m.edit('Playlist not found :(').catch(client.logger.error);
    }
  } else {
    try {
      const results = await youtube.searchPlaylists(search, 1, {
        part: 'snippet'
      });
      playlist = results[0];
      videos = await playlist.getVideos(MAX_VIDEOS, { part: 'snippet' });
    } catch (error) {
      client.logger.error(error);
      return m.edit('Playlist not found :(').catch(client.logger.error);
    }
  }

  let sInfoFull = [];
  for (let i = 0; i < videos.size; i++) {
    try {
    ytdl.getInfo(`https://youtube.com/watch?v=${videos[i].id}`).then(info => {
      client.logger.log(`
        title: ${info.videoDetails.title},
        url: ${info.videoDetails.video_url},
        duration: ${info.videoDetails.lengthSeconds}`);
      sInfoFull.push({
        title: info.videoDetails.title,
        url: info.videoDetails.video_url,
        duration: info.videoDetails.lengthSeconds     
      });
    });
    } catch (e) {
      client.logger.error(e.stack ? e.stack : e);
      continue;
    }
  }

  client.logger.log(JSON.stringify(sInfoFull));
  serverQueue ? serverQueue.songs.push(...sInfoFull) : queueConstruct.songs.push(...sInfoFull);
  
  const playlistEmbed = new MessageEmbed()
    .setTitle(playlist.title.replace(/&#(\d+);/g, (match, dec) => {
      return String.fromCharCode(dec);
    }))
    .setDescription(sInfoFull.map((song, index) => `${index + 1}. [${song.title}](${song.url}) (${new Date(song.duration * 1000).toISOString().substr(11, 8)})`))
    .setURL(playlist.url)
    .setColor('#F8AA2A')
    .setTimestamp();

  if (playlistEmbed.description.length >= 2048)
    playlistEmbed.description = playlistEmbed.description.substr(0, 2040) + '...';

  m.delete();
  message.channel.send(`${message.author} started a playlist`, playlistEmbed);

  if (!serverQueue) {
    client.queue.set(message.guild.id, queueConstruct);
    
    try {
      queueConstruct.connection = await channel.join();
      await queueConstruct.connection.voice.setSelfDeaf(true);
      play(queueConstruct.songs[0], message, false);
    } catch (error) {
      client.logger.error(error);
      client.queue.delete(message.guild.id);
      await channel.leave();
      return message.channel.send(`Could not join the channel: ${error}`).catch(client.logger.error);
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'playlist',
  description: 'Plays a playlist from YouTube',
  usage: 'playlist [youtube playlist url | playlist name]'
};

const { MessageEmbed } = require('discord.js'),
  { play } = require('../util/play'),
  YouTubeAPI = require('simple-youtube-api'),
  { google_api_key, prefix } = require('../settings.json'),

  youtube = new YouTubeAPI(google_api_key);

exports.run = async (client, message, args) => {
  const { channel } = message.member.voice;

  const serverQueue = client.queue.get(message.guild.id);
  if (serverQueue && channel !== message.guild.me.voice.channel)
    return message.reply(`You must be in the same channel as ${client.user}`).catch(client.logger.error);
  if (!args.length)
    return message
      .reply(`${prefix}${exports.help.usage}`)
      .catch(client.logger.error);
  if (!channel) return message.reply('you need to join a voice channel first!').catch(client.logger.error);

  const permissions = channel.permissionsFor(client.user);
  if (!permissions.has('CONNECT'))
    return message.reply('cannot connect to voice channel, missing **CONNECT** permission');
  if (!permissions.has('SPEAK'))
    return message.reply('I cannot speak in this voice channel, make sure I have the **SPEAK** permission');

  const search = args.join(' ');
  const pattern = /^.*(youtu.be\/|list=)([^#&?]*).*/gi;
  const url = args[0];
  const urlValid = pattern.test(args[0]);

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

  let song = null;
  let playlist = null;
  let videos = [];

  if (urlValid) {
    try {
      playlist = await youtube.getPlaylist(url, { part: 'snippet' });
      videos = await playlist.getVideos(20, { part: 'snippet' });
    } catch (error) {
      client.logger.error(error);
      return message.reply('Playlist not found :(').catch(client.logger.error);
    }
  } else {
    try {
      const results = await youtube.searchPlaylists(search, 1, {
        part: 'snippet',
      });
      playlist = results[0];
      videos = await playlist.getVideos(20, { part: 'snippet' });
    } catch (error) {
      client.logger.error(error);
      return message.reply('Playlist not found :(').catch(client.logger.error);
    }
  }

  const newSongs = videos.map(video => {
    return {
      title: video.title,
      url: video.url,
      duration: video.durationSeconds
    };
  });

  serverQueue ? serverQueue.songs.push(...newSongs) : queueConstruct.songs.push(...newSongs);
  const songs = serverQueue ? serverQueue.songs : queueConstruct.songs;

  const playlistEmbed = new MessageEmbed()
    .setTitle(playlist.title)
    .setDescription(songs.map((song, index) => `${index + 1}. ${song.title}`))
    .setURL(playlist.url)
    .setColor('#F8AA2A')
    .setTimestamp();

  if (playlistEmbed.description.length >= 2048)
    playlistEmbed.description = playlistEmbed.description.substr(0, 2020) + '...';

  message.channel.send(`${message.author} started a playlist`, playlistEmbed);

  if (!serverQueue) {
    client.queue.set(message.guild.id, queueConstruct);
    
    try {
      queueConstruct.connection = await channel.join();
      await queueConstruct.connection.voice.setSelfDeaf(true);
      play(queueConstruct.songs[0], message);
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

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

  videos.forEach(video => {
    song = {
      title: video.title,
      url: video.url,
      duration: video.durationSeconds,
    };

    if (serverQueue) {
      serverQueue.songs.push(song);
      message.channel
        .send(`✅ **${song.title}** has been added to the queue by ${message.author}`)
        .catch(client.logger.error);
    }
  });

  const playlistEmbed = new MessageEmbed()
    .setTitle(`${playlist.title}`)
    .setURL(playlist.url)
    .setColor('#F8AA2A')
    .setTimestamp();

  playlistEmbed.setDescription(queueConstruct.songs.map((song, index) => `${index + 1}. ${song.title}`));
  if (playlistEmbed.description.length >= 2048)
    playlistEmbed.description = playlistEmbed.description.substr(0, 2007) + '\nPlaylist larger than character limit...';

  message.channel.send(`${message.author} Started a playlist`, playlistEmbed);

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

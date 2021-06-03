const { MessageEmbed } = require('discord.js');
const { play } = require('../util/play');
const YouTubeAPI = require('simple-youtube-api');
const fetch = require('node-superfetch');
const moment = require('moment');

exports.run = async (client, message, args) => {
  try {
    if (!process.env.google_api_key) return message.reply('the bot owner has not set up this command yet');
    const { channel } = message.member.voice;
    const youtube = new YouTubeAPI(process.env.google_api_key);
    const serverQueue = client.queue.get(message.guild.id);
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message.reply(`you must be in the same channel as me (${message.guild.me.voice.channel})`);
    if (!args.length)
      return message.reply(`usage: ${client.getPrefix(message)}${exports.help.usage}`);
    if (!channel)
      return message.reply('you need to join a voice channel first!');

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

    let playlist, videos = [];
    const ids = [];

    if (urlValid) {
      try {
        playlist = await youtube.getPlaylist(url, { part: 'snippet' });
        videos = await playlist.getVideos(50);
        for (const video of videos)
          ids.push(`&id=${video.id}`);
        videos = await fetch.get(`https://www.googleapis.com/youtube/v3/videos?key=${process.env.google_api_key}&part=snippet&part=contentDetails${ids.join('')}`);
      } catch (error) {
        client.logger.error(error);
        return message.reply(`an error occurred: ${error}`);
      }
    } else {
      try {
        const results = await youtube.searchPlaylists(search, 1, { part: 'snippet' });
        playlist = results[0];
        videos = await playlist.getVideos(50);
        for (const video of videos)
          ids.push(`&id=${video.id}`);
        videos = await fetch.get(`https://www.googleapis.com/youtube/v3/videos?key=${process.env.google_api_key}&part=snippet&part=contentDetails${ids.join('')}`);
      } catch (error) {
        client.logger.error(error);
        return message.reply(`an error occurred: ${error}`);
      }
    }

    const newSongs = videos.body.items
      .map(video => {
        return {
          title: video.snippet.title,
          url: `https://www.youtube.com/watch?v=${video.id}`,
          duration: moment.duration(video.contentDetails.duration).asSeconds(),
          thumbnail: video.snippet.thumbnails.maxres || video.snippet.thumbnails.standard,
          channel: {
            name: video.snippet.channelTitle,
            profile_pic: '',
            url: `https://youtube.com/channel/${video.snippet.channelId}`
          },
          publishDate: video.snippet.publishedAt
        };
      });

    serverQueue ? serverQueue.songs.push(...newSongs) : queueConstruct.songs.push(...newSongs);

    const playlistEmbed = new MessageEmbed()
      .setTitle(playlist.title.replace(/&#(\d+);/g, (match, dec) => {
        return String.fromCharCode(dec);
      }))
      .setDescription(newSongs.map((song, index) => `${index + 1}. [${song.title}](${song.url})`))
      .setURL(playlist.url)
      .setColor('#F8AA2A')
      .setTimestamp();

    if (playlistEmbed.description.length >= 2048)
      playlistEmbed.description = playlistEmbed.description.substr(0, 2040) + '...';

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
        return message.reply(`could not join the channel: ${error}`);
      }
    }
  } catch (err) {
    return message.channel.send(new MessageEmbed()
      .setColor('#FF0000')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`**Stack Trace:**\n\`\`\`${err.stack}\`\`\``)
      .addField('**Command:**', `${message.content}`)
    );
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['list'],
  permLevel: 0,
  cooldown: 12000
};

exports.help = {
  name: 'playlist',
  description: 'Plays a playlist from YouTube',
  usage: 'playlist [youtube playlist url | playlist name]'
};

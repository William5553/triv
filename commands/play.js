const { play } = require('../util/play');
const { getInfo } = require('ytdl-core');
const YouTubeAPI = require('simple-youtube-api');
const process = require('node:process');
const { validUrl } = require('../util/Util');
const { MessageEmbed, Permissions, Message } = require('discord.js');

let youtube;

if (process.env.google_api_key)
  youtube = new YouTubeAPI(process.env.google_api_key);

exports.run = async (client, message, args) => {
  try {
    if (args.length === 0) return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
    let { channel } = message.member.voice;
    let forced = false;
    // the owner can play a video to any channel if they put the channel id in ampersands
    if (client.owners.includes(message.author.id) && /&((?:\\.|[^&\\])*)&/.test(args.join(' '))) {
      channel = await client.channels.fetch(args.join(' ').match(/&((?:\\.|[^&\\])*)&/)[0].replace(/( |)&( |)/g, ''));
      forced = true;
    }
    if (!channel) return message.reply('You need to join a voice channel first!');
    const serverQueue = client.queue.get(channel.guild.id);
    if (serverQueue && channel.id !== message.guild.me.voice.channelId)
      return message.reply(`You must be in the same channel as me (${message.guild.me.voice.channel})`);
    const permissions = channel.permissionsFor(client.user);
    if (!permissions.has(Permissions.FLAGS.CONNECT))
      return message.reply('I cannot connect to the voice channel, missing the **CONNECT** permission');
    if (!permissions.has(Permissions.FLAGS.SPEAK))
      return message.reply('I cannot speak in this voice channel, make sure I have the **SPEAK** permission!');

    const search = args.join(' ').replace(/( |)&((?:\\.|[^&\\])*)&( |)/g, '');
    const ytRegex = /^(https?:\/\/|http?:\/\/)?(www\.)?(m\.|music\.)?(youtube\.com|youtu\.?be)\/.+$/i;

    // Start the playlist if playlist url was provided
    if (!ytRegex.test(args[0]) && /^.*(list=)([^#&?]*).*/gi.test(args[0]))
      return client.commands.get('playlist').run(client, message, args);

    const queueConstruct = {
      forced,
      textChannel: message.channel,
      channel,
      songs: [],
      loop: false,
      volume: 100,
      playing: true,
      additionalStreamTime: 0,
      filters: {
        bassboost: false,
        '8d': false,
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
        mcompand: false,
        earwax: false
      }
    };

    let songInfo, results;

    // if youtube url was inputted
    if (ytRegex.test(search)) {
      try {
        songInfo = await getInfo(search);
      } catch (error) {
        return message.reply(error.message.includes('410') ? 'Video is age restricted, private or unavailable.' : error.message);
      }
    } else if (!ytRegex.test(search) && !validUrl(search) && process.env.google_api_key) {
      // if search query was inputted (not valid url)
      try {
        results = await youtube.searchVideos(search, 1);
        if (results[0])
          songInfo = await getInfo(`https://www.youtube.com/watch?v=${results[0].id}`);
        else
          return message.reply(`No results found for ${search}`);
      } catch (error) {
        if (error.message.includes('410'))
          return message.reply('Video is age restricted, private or unavailable.');
        client.logger.error(error.stack ?? error);
        return message.channel.send({embeds: [
          new MessageEmbed()
            .setColor('#FF0000')
            .setTimestamp()
            .setTitle('Please report this on GitHub')
            .setURL('https://github.com/william5553/triv/issues')
            .setDescription(`**ytdl-core failed to search:\n\nStack Trace:**\n\`\`\`${error.stack ?? error}\`\`\``)
            .addField('**Command:**', message.content)
        ]});
      }
    }

    const song = songInfo ? {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
      duration: songInfo.videoDetails.lengthSeconds,
      thumbnail: songInfo.videoDetails.thumbnails[songInfo.videoDetails.thumbnails.length - 1],
      publishDate: songInfo.videoDetails.publishDate,
      channel: {
        name: songInfo.videoDetails.author.name,
        profile_pic: songInfo.videoDetails.author.thumbnails[songInfo.videoDetails.author.thumbnails.length - 1].url || '',
        url: songInfo.videoDetails.author.channel_url
      }
    } : {
      url: search
    };

    if (serverQueue) {
      serverQueue.songs.push(song);
      // sometimes the age restriction bypass works, sometimes it doesn't
      return serverQueue.textChannel.send(`✅ **${song.title ?? song.url}** has been added to the queue by ${message.author}${songInfo && songInfo.videoDetails.age_restricted ? '\n**Disclaimer: this video is age restricted so it may not work**' : ''}`);
    }

    queueConstruct.songs.push(song);

    try {
      const connection = await client.commands.get('join').run(client, message, [channel.id]);
      if (connection instanceof Message) return;
      queueConstruct.connection = connection;
      client.queue.set(message.guild.id, queueConstruct);
      play(song, message, false);
    } catch (error) {
      client.logger.error(error.stack ?? error);
      await client.queue.get(message.guild.id)?.connection?.destroy();
      return message.reply(`Could not join the voice channel: ${error.stack ?? error}`);
    }
  } catch (error) {
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor('#FF0000')
        .setTimestamp()
        .setTitle('Please report this on GitHub')
        .setURL('https://github.com/william5553/triv/issues')
        .setDescription(`**Stack Trace:**\n\`\`\`${error.stack ?? error}\`\`\``)
        .addField('**Command:**', message.content)
    ]});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['p'],
  permLevel: 0,
  cooldown: 7500
};

exports.help = {
  name: 'play',
  description: 'Plays audio. Supported sites: https://ytdl-org.github.io/youtube-dl/supportedsites.html',
  usage: 'play [URL OR Search Query]',
  example: 'play https://www.youtube.com/watch?v=dQw4w9WgXcQ'
};

const { play } = require('../util/play');
const ytdl = require('ytdl-core');
const YouTubeAPI = require('simple-youtube-api');
const { MessageEmbed, Permissions, Message } = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    if (!process.env.google_api_key) return message.reply('The bot owner has not set up this command yet');
    if (!args.length)
      return message.reply(`${client.getPrefix(message)}${exports.help.usage}`);
    const youtube = new YouTubeAPI(process.env.google_api_key);
    let { channel } = message.member.voice, forced = false;
    // the owner can play a video to any channel if they put the channel id in ampersands
    if (client.owners.includes(message.author.id) && args.join(' ').match(/&((?:\\.|[^&\\])*)&/)) {
      channel = await client.channels.fetch(args.join(' ').match(/&((?:\\.|[^&\\])*)&/)[0].replace(/( |)&( |)/g, ''));
      forced = true;
    }
    if (!channel)
      return message.reply('You need to join a voice channel first!');
    const serverQueue = client.queue.get(channel.guild.id);
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message.reply(`You must be in the same channel as me (${message.guild.me.voice.channel})`);
    const permissions = channel.permissionsFor(client.user);
    if (!permissions.has(Permissions.FLAGS.CONNECT))
      return message.reply('I cannot connect to the voice channel, missing the **CONNECT** permission');
    if (!permissions.has(Permissions.FLAGS.SPEAK))
      return message.reply('I cannot speak in this voice channel, make sure I have the **SPEAK** permission!');

    const search = args.join(' ').replace(/( |)&((?:\\.|[^&\\])*)&( |)/g, '');
    const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;

    // Start the playlist if playlist url was provided
    if (!videoPattern.test(args[0]) && /^.*(list=)([^#&?]*).*/gi.test(args[0]))
      return client.commands.get('playlist').run(client, message, args);

    const queueConstruct = {
      forced,
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

    let songInfo, song;

    // if url was inputted
    if (videoPattern.test(search)) {
      try {
        songInfo = await ytdl.getInfo(search);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds,
          thumbnail: songInfo.videoDetails.thumbnails[songInfo.videoDetails.thumbnails.length - 1],
          channel: {name: songInfo.videoDetails.author.name, profile_pic: songInfo.videoDetails.author.thumbnails[songInfo.videoDetails.author.thumbnails.length - 1].url, url: songInfo.videoDetails.author.user_url},
          publishDate: songInfo.videoDetails.publishDate
        };
      } catch (error) {
        client.logger.error(error.stack || error);
        return message.reply(error.message);
      }
    } else {
    // if search query was inputted
      try {
        const results = await youtube.searchVideos(search, 1);
        songInfo = await ytdl.getInfo(results[0]?.url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds,
          thumbnail: songInfo.videoDetails.thumbnails[songInfo.videoDetails.thumbnails.length - 1],
          channel: {
            name: songInfo.videoDetails.author.name,
            profile_pic: songInfo.videoDetails.author.thumbnails[songInfo.videoDetails.author.thumbnails.length - 1].url,
            url: songInfo.videoDetails.author.user_url
          },
          publishDate: songInfo.videoDetails.publishDate
        };
      } catch (error) {
        client.logger.error(error.stack || error);
        return message.channel.send({embeds: [new MessageEmbed()
          .setColor('#FF0000')
          .setTimestamp()
          .setTitle('Please report this on GitHub')
          .setURL('https://github.com/william5553/triv/issues')
          .setDescription(`**ytdl-core failed to search:\n\nStack Trace:**\n\`\`\`${error.stack || error}\`\`\``)
          .addField('**Command:**', `${message.content}`)
        ]});
      }
    }

    if (serverQueue) {
      serverQueue.songs.push(song);
      return serverQueue.textChannel.send(`✅ **${song.title}** has been added to the queue by ${message.author}`);
    }

    queueConstruct.songs.push(song);
    client.queue.set(message.guild.id, queueConstruct);

    try {
      const connection = await client.commands.get('join').run(client, message);
      if (connection instanceof Message) return;
      queueConstruct.connection = connection;
      play(queueConstruct.songs[0], message, false);
    } catch (error) {
      client.logger.error(error);
      await client.queue.get(message.guild.id).connection.destroy();
      return message.reply(`could not join the channel: ${error.stack || error}`);
    }
  } catch (err) {
    return message.channel.send({embeds: [new MessageEmbed()
      .setColor('#FF0000')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`**Stack Trace:**\n\`\`\`${err.stack || err}\`\`\``)
      .addField('**Command:**', `${message.content}`)
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
  description: 'Plays audio from YouTube',
  usage: 'play [YouTube URL OR Video Name]',
  example: 'play https://www.youtube.com/watch?v=dQw4w9WgXcQ'
};

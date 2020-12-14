const { MessageEmbed } = require('discord.js'),
  Genius = require('genius-lyrics');

exports.run = async (client, message, args) => {
  const GClient = new Genius.SongsClient(client.settings.genius_api_key);
  let query, queue;
  if (message.guild) queue = client.queue.get(message.guild.id);
  if (args.length >= 1)
    query = args.join(' ');
  else if (queue && queue.songs)
    query = queue.songs[0].title;
  else return message.reply("there is nothing playing and you didn't specify a song title.").catch(client.logger.error);

  let lyrics = null;
  let emtitle = null;

  const songtitle = query.replace(/\([^()]*\)/g, '');

  try {
    const search = await GClient.search(songtitle);
    lyrics = await search[0].lyrics(false);
    emtitle = search[0].fullTitle;
    if (!lyrics) lyrics = `No lyrics found for ${songtitle}.`;
    if (!emtitle) emtitle = songtitle;
  } catch (error) {
    lyrics = `No lyrics found for ${songtitle}.`;
    emtitle = songtitle;
  }

  const lyricsEmbed = new MessageEmbed()
    .setTitle('Lyrics - ' + emtitle)
    .setDescription(lyrics)
    .setColor('#F8AA2A');

  let i;
  for (i = 0; i * 1950 <= lyrics.length; i++) {
    lyricsEmbed.description = `${lyrics.substr(i * 1950, i * 1950 + 1950)}`;
    message.channel.send(lyricsEmbed).catch(client.logger.error);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'lyrics',
  description: 'Gets the lyrics for the currently playing song or specified song',
  usage: 'lyrics [song title]'
};

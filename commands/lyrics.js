const settings = require('../settings.json');
const { MessageEmbed } = require('discord.js');
const Genius = require('genius-lyrics');
const GClient = new Genius.SongsClient(settings.genius_api_key);

exports.run = async (client, message, args) => {
  const queue = client.queue.get(message.guild.id);
  if (!queue) return message.reply('there is nothing playing.').catch(client.logger.error);

  let lyrics = null;
  let emtitle = null;

  const songtitle = queue.songs[0].title.replace(/\([^()]*\)/g, '');

  try {
    const search = await GClient.search(songtitle);
    lyrics = await search[0].lyrics(false);
    emtitle = search[0].fullTitle;
    if (!lyrics) lyrics = `No lyrics found for ${songtitle}.`;
    if (!emtitle) emtitle = songtitle;
  } catch (error) {
    client.logger.error(error);
    lyrics = `No lyrics found for ${songtitle}.`;
    emtitle = songtitle;
  }

  const lyricsEmbed = new MessageEmbed()
    .setTitle('Lyrics - ' + emtitle)
    .setDescription(lyrics)
    .setColor('#F8AA2A');

  for (i = 0; i * 1950 <= lyrics.length; i++) {
    lyricsEmbed.description = `${lyrics.substr(i * 1950, i * 1950 + 1950)}`;
    message.channel.send(lyricsEmbed).catch(client.logger.error);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
};

exports.help = {
  name: 'lyrics',
  description: 'Gets the lyrics for the currently playing song',
  usage: 'lyrics',
};

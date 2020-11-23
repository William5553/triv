const settings = require('../settings.json');
const { MessageEmbed } = require("discord.js");
const GeniusFetcher = require("genius-lyrics-fetcher");
const GClient = new GeniusFetcher.Client(settings.genius_api_key);

exports.run = async (client, message, args) => {
  const queue = client.queue.get(message.guild.id);
  if (!queue)
    return message.reply("there is nothing playing.").catch(client.logger.error);

  let lyrics = null;
  
  const songtitle = queue.songs[0].title.replace(/\([^()]*\)/g, '');
  const splitsong = songtitle.split('-');
  
  try {
    lyrics = await GClient.fetch(splitsong[1], splitsong[0]).lyrics;
    if (!lyrics) lyrics = `No lyrics found for ${songtitle}.`;
  } catch (error) {
    lyrics = `No lyrics found for ${songtitle}.`;
  }

  const lyricsEmbed = new MessageEmbed()
    .setTitle('Lyrics - ' + songtitle)
    .setDescription(lyrics)
    .setColor("#F8AA2A");

  if (lyricsEmbed.description.length >= 2048)
    lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
  return message.channel.send(lyricsEmbed).catch(client.logger.error);
};

  exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'lyrics',
  description: 'Gets the lyrics for the currently playing song',
  usage: 'lyrics'
};

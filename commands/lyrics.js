const settings = require("../settings.json");
const { MessageEmbed } = require("discord.js");
const Genius = require("genius-lyrics");
const GClient = new Genius.Client(settings.genius_api_key);

exports.run = async (client, message, args) => {
  const queue = client.queue.get(message.guild.id);
  if (!queue)
    return message.channel
      .send("There is nothing playing.")
      .catch(client.logger.error);

  let lyrics = null;

  const songtitle = queue.songs[0].title
    .replace("/(official video/i", "")
    .replace("/(official music video)/i", "");

  try {
    const searches = await GClient.songs.search(songtitle);
    const firstSong = searches[0];
    lyrics = await firstSong.lyrics();
    if (!lyrics) lyrics = `No lyrics found for ${songtitle}.`;
  } catch (error) {
    lyrics = `No lyrics found for ${songtitle}.`;
  }

  const lyricsEmbed = new MessageEmbed()
    .setTitle("Lyrics")
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

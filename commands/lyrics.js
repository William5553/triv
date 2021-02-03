const { MessageEmbed } = require('discord.js'),
  Genius = require('genius-lyrics');

exports.run = async (client, message, args) => {
  if (!client.settings.genius_api_key) return message.reply('the bot owner has not set up this command yet');
  const GClient = new Genius.SongsClient(client.settings.genius_api_key);
  let query, queue;
  if (message.guild) queue = client.queue.get(message.guild.id);
  if (args.length >= 1)
    query = args.join(' ');
  else if (queue && queue.songs)
    query = queue.songs[0].title;
  else if (message.author.presence.activities.length) {
    let tomato;
    message.author.presence.activities.forEach(async activity => {
      if (activity.type === 'LISTENING' && activity.name === 'Spotify') 
        tomato = activity;
      });
    await message.channel.send(new MessageEmbed()
          .setColor('GREEN')
          .setAuthor('Spotify', 'https://cdn.discordapp.com/emojis/408668371039682560.png')
          .setDescription(`You are currently listening to [**${tomato.details}** by **${tomato.state.replace(/;/g, ',')}**](https://open.spotify.com/track/${tomato.syncID}) in the album **${tomato.assets.largeText}** on Spotify, would you like to get the lyrics of that song?`)
        );
        const verification = await client.verify(message.channel, message.author);
        if (verification != true) return message.channel.send('Okay, you can also specify a song to fetch the lyrics for');
        query = `${tomato.details} ${tomato.state.replace(/;/g, '')}`;
    }
  }
  if (!query) return message.reply("there is nothing playing and you didn't specify a song title.").catch(client.logger.error);

  let lyrics, emtitle;

  const songtitle = query.replace(/\([^()]*\)/g, '');

  try {
    const search = await GClient.search(songtitle);
    lyrics = await search[0].lyrics(false) || `No lyrics found for ${songtitle}.`;
    emtitle = search[0].fullTitle || songtitle;
  } catch (error) {
    lyrics = `No lyrics found for ${songtitle}.`;
    emtitle = songtitle;
  }

  const lyricsEmbed = new MessageEmbed()
    .setTitle('Lyrics - ' + emtitle)
    .setDescription(lyrics)
    .setColor('#F8AA2A');

  for (let i = 0; i * 1750 <= lyrics.length; i++) {
    lyricsEmbed.description = `${lyrics.substr(i * 1750, i * 1750 + 1750)}`;
    message.channel.send(lyricsEmbed).catch(client.logger.error);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['ly'],
  permLevel: 0
};

exports.help = {
  name: 'lyrics',
  description: 'Gets the lyrics for the currently playing song or specified song',
  usage: 'lyrics [song title]'
};

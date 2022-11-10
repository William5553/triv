const { MessageEmbed } = require('discord.js');
const { verify, splitMessage } = require('../util/Util');
const { Client, SongsClient } = require('genius-lyrics');

const clientConfig = new Client(process.env.genius_api_key || undefined);
const GClient = new SongsClient(clientConfig);

exports.run = async (client, message, args) => {
  let query, queue;
  if (message.guild) queue = client.queue.get(message.guild.id);
  if (args && args.length > 0)
    query = args.join(' ');
  else if (queue && queue.songs && queue.songs[0].title)
    query = queue.songs[0].title;
  else if (message.member.presence.activities.length > 0) {
    const listening = await message.member.presence.activities.find(activity => activity.type === 'LISTENING' && activity.name === 'Spotify');
    if (!listening) return message.reply("There isn't anything playing and you didn't specify a song title.");
    await message.channel.send({embeds: [
      new MessageEmbed()
        .setColor('GREEN')
        .setAuthor({ name: 'Spotify', iconURL: 'https://cdn.discordapp.com/emojis/408668371039682560.png' })
        .setDescription(`You are currently listening to [**${listening.details}** by **${listening.state.split(';')[0]}**](https://open.spotify.com/track/${listening.syncId}) in the album **${listening.assets.largeText}** on Spotify, would you like to get the lyrics of that song?`)
    ]});
    const verification = await verify(message.channel, message.author);
    if (verification != true) return message.channel.send('Okay, you can also specify a song to fetch the lyrics for.');
    query = `${listening.details} ${listening.state.split(';')[0]}`;
  }
  if (!query) return message.reply("The current song is not supported or there is nothing playing. You also didn't specify a song title.");

  let lyrics, emtitle;

  try {
    const search = await GClient.search(query, { sanitizeQuery: true });
    lyrics = await search[0].lyrics(false);
    emtitle = search[0].fullTitle;
  } catch (error) {
    message.channel.send(`No lyrics found for ${query}: ${error.message || error}`);
    return 'No lyrics found';
  }

  try {
    const embeds = [];

    for (const m of splitMessage(lyrics, { maxLength: 1900 })) {
      if (embeds.length < 10) 
        embeds.push(new MessageEmbed()
          .setTitle(embeds.length === 0 ? emtitle : '')
          .setDescription(m)
          .setColor('#F8AA2A')
        );
    }
    message.channel.send({ embeds });
  } catch (error) {
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor('#FF0000')
        .setTimestamp()
        .setTitle('Please report this on GitHub')
        .setURL('https://github.com/william5553/triv/issues')
        .setDescription(`**Stack Trace:**\n\`\`\`${error.stack ?? error}\`\`\``)
        .addFields({ name: '**Command:**', value: message.content })
    ]});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['ly'],
  permLevel: 0,
  cooldown: 2000
};

exports.help = {
  name: 'lyrics',
  description: 'Gets the lyrics for the currently playing song (YouTube only) or specified song',
  usage: 'lyrics [song title]',
  example: 'lyrics Mo Bamba'
};
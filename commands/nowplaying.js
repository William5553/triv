const { MessageEmbed } = require('discord.js');
const { formatDate } = require('../util/Util');

exports.run = async (client, message) => {
  try {
    const queue = client.queue.get(message.guild.id);
    if (!queue || !queue.connection) return message.reply('There is nothing playing.');
    // if (isNaN(queue.resource.playbackDuration)) return message.reply('Please try again after I resume playing music');
    const song = queue.songs[0];
    const seek = queue.resource.playbackDuration / 1000;

    const bar = createBar(song.duration == 0 ? seek : song.duration, seek);
    const nowPlaying = new MessageEmbed()
      .setTitle(song.title)
      .setURL(song.url)
      .setColor('#FF0000')
      .setThumbnail(song.thumbnail.url)
      .setAuthor(song.channel.name, song.channel.profile_pic, song.channel.url)
      .setDescription(`**${Math.floor(bar[1] * 100) / 100}% done**\n${getTime(seek)} [${bar[0]}] ${song.duration == 0 ? ' ◉ LIVE' : getTime(song.duration)}`);

    if (song.duration > 0)
      nowPlaying.setFooter(`Time Remaining: ${getTime(song.duration - seek)} | Started at ${formatDate(Date.now() - seek)}`);

    return message.channel.send({embeds: [nowPlaying]});
  } catch (err) {
    client.logger.error(err.stack || err);
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor('#FF0000')
        .setTimestamp()
        .setTitle('Please report this on GitHub')
        .setURL('https://github.com/william5553/triv/issues')
        .setDescription(`**Stack Trace:**\n\`\`\`${err.stack || err}\`\`\``)
        .addField('**Command:**', message.content)
    ]});
  }
};

const getTime = time => new Date(time * 1000).toISOString().substr(11, 8);

const createBar = (total, current, size = 20, line = '▬', slider = '🔘') => {
  if (isNaN(total)) throw new Error('Total value is not an integer');
  if (isNaN(current)) throw new Error('Current value is not an integer');
  if (isNaN(size)) throw new Error('Size is not an integer');
  if (current > total) 
    return [line.repeat(size + 2), current / total * 100];
  else {
    const progress = Math.round(size * (current / total));
    const progressText = line.repeat(progress).replace(/.$/, slider);
    const emptyProgressText = line.repeat(size - progress);
    return [`${progressText}${emptyProgressText}`, current / total * 100];
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['np'],
  permLevel: 0,
  cooldown: 2000
};

exports.help = {
  name: 'nowplaying',
  description: 'Shows the song that is currently playing',
  usage: 'nowplaying',
  example: 'nowplaying'
};

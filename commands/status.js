const { MessageEmbed } = require('discord.js');

exports.run = (client, message, args) => {
  const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;

  if (!user.presence.activities.length) {
    return message.channel.send(new MessageEmbed()
      .setAuthor(user.user.username, user.user.displayAvatarURL({ dynamic: true }))
      .setColor('GREEN')
      .setTitle('**No Status**')
      .setDescription('This user does not have a custom status!')
      .setTimestamp()
    );
  }

  user.presence.activities.forEach((activity) => {
    if (activity.type === 'CUSTOM_STATUS') {
      message.channel.send(new MessageEmbed()
        .setAuthor(user.user.username, user.user.displayAvatarURL({ dynamic: true }))
        .setColor('GREEN')
        .setTitle(`${user.user.username}'s Activity`)
        .setDescription(`**Custom Status**\n${activity.emoji || 'No Emoji'} | ${activity.state || 'No State'}`)
        .setTimestamp()
      );
    } else if (activity.type === 'PLAYING') {
      message.channel.send(new MessageEmbed()
        .setAuthor(`${user.user.username}'s Activity`, user.user.displayAvatarURL({ dynamic: true }))
        .setColor(0xFFFF00)
        .addField('**Type**', 'Playing')
        .addField('**App**', `${activity.name}`)
        .addField('**Details**', `${activity.details || 'No Details'}`)
        .addField('**Working on**', `${activity.state || 'No Details'}`)
      );
    } else if (activity.type === 'LISTENING' && activity.name === 'Spotify' && activity.assets) {
      const trackIMG = `https://i.scdn.co/image/${activity.assets.largeImage.slice(8)}`;
      const trackURL = `https://open.spotify.com/track/${activity.syncID}`;

      const trackName = activity.details;
      let trackAuthor = activity.state;
      const trackAlbum = activity.assets.largeText;

      trackAuthor = trackAuthor.replace(/;/g, ',');

      message.channel.send(new MessageEmbed()
        .setAuthor('Spotify Track Info', 'https://cdn.discordapp.com/emojis/408668371039682560.png')
        .setColor('GREEN')
        .setTimestamp()
        .setThumbnail(trackIMG)
        .addField('Song Name', trackName, true)
        .addField('Album', trackAlbum, true)
        .addField('Author', trackAuthor, false)
        .addField('Listen to Track', `${trackURL}`, false)
        .setFooter(user.displayName, user.user.displayAvatarURL({ dynamic: true }))
      );
    }
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['activity', 'presence'],
  permLevel: 0
};

exports.help = {
  name: 'status',
  description: "Gets a user's status",
  usage: 'status [user]'
};

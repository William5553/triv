const { MessageEmbed } = require('discord.js');

exports.run = (client, message, args) => {
  try {
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;

    if (!user.presence.activities.length) {
      return message.channel.send(new MessageEmbed()
        .setAuthor(user.displayName, user.user.displayAvatarURL({ dynamic: true }))
        .setColor('#FF0000')
        .setTitle('**No Status**')
        .setDescription('This user does not have a custom status!')
        .setTimestamp()
      );
    }

    user.presence.activities.forEach(activity => {
      if (activity.type === 'CUSTOM_STATUS') {
        message.channel.send(new MessageEmbed()
          .setAuthor(`${user.displayName}'s Activity`, user.user.displayAvatarURL({ dynamic: true }))
          .setColor('GREEN')
          .setDescription(`**Custom Status**\n${activity.emoji || 'No Emoji'} | ${activity.state || 'No State'}`)
          .setTimestamp()
        );
      } else if (activity.type === 'PLAYING') {
        const embed = new MessageEmbed()
          .setAuthor(`${user.displayName}'s Activity`, user.user.displayAvatarURL({ dynamic: true }))
          .setColor('GREEN')
          .addField('**Type**', 'Playing')
          .addField('**App**', activity.name);
        if (activity.details)
          embed.addField('**Details**', activity.details);
        if (activity.state)
          embed.addField('**State**', activity.state);
        if (activity.assets && activity.assets.largeText)
          embed.addField('**Large Text**', activity.assets.largeText);
        if (activity.assets && activity.assets.smallText)
          embed.addField('**Small Text**', activity.assets.smallText);
        if (activity.url)
          embed.setURL(activity.url);
        if (activity.timestamps && activity.timestamps.start) {
          embed.setFooter('Started at');
          embed.setTimestamp(new Date(activity.timestamps.start));
        } else if (activity.createdTimestamp) {
          embed.setFooter('Started at');
          embed.setTimestamp(activity.createdTimestamp);
        }
        message.channel.send(embed);
      } else if (activity.type === 'LISTENING' && activity.name === 'Spotify' && activity.assets) {
        message.channel.send(new MessageEmbed()
          .setAuthor('Spotify Track Info', 'https://cdn.discordapp.com/emojis/408668371039682560.png')
          .setColor('GREEN')
          .setTimestamp()
          .setThumbnail(`https://i.scdn.co/image/${activity.assets.largeImage.slice(8)}`)
          .addField('Song Name', activity.details, true)
          .addField('Album', activity.assets.largeText, true)
          .addField('Author', activity.state.replace(/;/g, ','), true)
          .addField('Listen to Track', `https://open.spotify.com/track/${activity.syncID}`, false)
          .setFooter(user.displayName, user.user.displayAvatarURL({ dynamic: true }))
        );
      }
    });
  } catch (err) {
    return message.channel.send(new MessageEmbed()
      .setColor('#FF0000')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`**Stack Trace:**\n\`\`\`${err.stack}\`\`\``)
      .addField('**Command:**', `${message.content}`)
    );
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['activity', 'presence'],
  permLevel: 0,
  cooldown: 1000
};

exports.help = {
  name: 'status',
  description: "Gets a user's status",
  usage: 'status [user]'
};

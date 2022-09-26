const { MessageEmbed } = require('discord.js');
const moment = require('moment');

require('moment-duration-format');

exports.run = (client, message, args) => {
  try {
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;

    const embeds = [];
    if (user?.presence?.clientStatus) {
      const embed = new MessageEmbed()
        .setAuthor({ name: `${user.displayName}'s Activity`, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
        .setColor('GREEN')
        .setTimestamp()
        .addFields([
          { name: 'Web', value: user.presence.clientStatus?.web ?? 'Offline' },
          { name: 'Mobile', value: user.presence.clientStatus?.mobile ?? 'Offline' },
          { name: 'Desktop', value: user.presence.clientStatus?.desktop ?? 'Offline' }
        ]);
      embeds.push(embed);
    }

    if ((!user?.presence?.activities || user?.presence?.activities?.length === 0) && embeds.length === 0) {
      return message.channel.send({embeds: [
        new MessageEmbed()
          .setAuthor({ name: user.displayName, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
          .setColor('#FF0000')
          .setTitle('**No Status**')
          .setDescription('This user does not have a custom status!')
          .setTimestamp()
      ]});
    }

    for (const activity of user.presence.activities) {
      if (activity.type === 'CUSTOM_STATUS') {
        embeds.push(new MessageEmbed()
          .setAuthor({ name: `${user.displayName}'s Activity`, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
          .setColor('GREEN')
          .setDescription(`**Custom Status**\n${activity.emoji || 'No Emoji'} | ${activity.state || 'No State'}`)
          .setTimestamp()
        );
      } else if (activity.type === 'PLAYING') {
        const embed = new MessageEmbed()
          .setAuthor({ name: `${user.displayName}'s Activity`, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
          .setColor('GREEN')
          .addFields([
            { name: '**Type**', value: 'Playing' },
            { name: '**App**', value: activity.name }
          ]);
        if (activity.details)
          embed.addFields({ name: '**Details**', value: activity.details });
        if (activity.state)
          embed.addFields([{ name: '**State**', value: activity.state }]);
        if (activity.assets && activity.assets.largeText)
          embed.addFields([{ name: '**Large Text**', value: activity.assets.largeText }]);
        if (activity.assets && activity.assets.smallText)
          embed.addFields([{ name: '**Small Text**', value: activity.assets.smallText }]);
        if (activity.url)
          embed.setURL(activity.url);
        if (activity.timestamps && activity.timestamps.start) {
          embed.setFooter({ text: `Time elapsed: ${moment.duration(Date.now() - activity.timestamps.start).format('hh:mm:ss')} | Started at` });
          embed.setTimestamp(activity.timestamps.start);
        } else if (activity.createdTimestamp) {
          embed.setFooter({ text: `Time elapsed: ${moment.duration(Date.now() - activity.createdTimestamp).format('hh:mm:ss')} | Started at` });
          embed.setTimestamp(activity.createdTimestamp);
        }
        embeds.push(embed);
      } else if (activity.type === 'LISTENING' && activity.name === 'Spotify' && activity.assets) {
        embeds.push(
          new MessageEmbed()
            .setAuthor({ name: 'Spotify Track Info', iconURL: 'https://cdn.discordapp.com/emojis/408668371039682560.png' })
            .setColor('GREEN')
            .setTimestamp()
            .setThumbnail(`https://i.scdn.co/image/${activity.assets.largeImage.slice(8)}`)
            .addFields(
              { name: 'Song Name', value: activity.details, inline: true },
              { name: 'Album', value: activity.assets.largeText, inline: true },
              { name: 'Author', value: activity.state.replaceAll(';', ','), inline: true },
              { name: 'Listen to Track', value: `https://open.spotify.com/track/${activity.syncId}`, inline: false }
            )
            .setFooter({ text: user.displayName, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
        );
      }
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
  guildOnly: true,
  aliases: ['activity', 'presence'],
  permLevel: 0,
  cooldown: 1000
};

exports.help = {
  name: 'status',
  description: "Gets a user's status",
  usage: 'status [user]',
  example: 'status'
};

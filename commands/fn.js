const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const settings = require('../settings.json');
exports.run = async (c, m, a) => {
  if (a.length >= 2) {
    var epicName = a.slice(1).join(' ');
    let platform = a[0].toLowerCase();
    if (platform == 'xbox' || platform == 'xb' || platform == 'xb1') platform = 'xbl';
    if (platform == 'ps4' || platform == 'ps5' || platform == 'ps' || platform == 'playstation') platform = 'psn';
    if (!(platform == 'pc' || platform == 'psn' || platform == 'xbl')) {
      return m.reply({
        embed: new MessageEmbed()
          .setAuthor(
            '400: Invalid platform',
            'https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png'
          )
          .setColor('#ff3860')
          .setDescription('Valid platforms are **pc**, **xbl** and **psn**'),
      });
    }
    var e = await m.reply({
      embed: new MessageEmbed().setTitle('Working...').setDescription('Please wait a few seconds').setColor('#ffdd57'),
    });
    var r = await fetch(`https://api.fortnitetracker.com/v1/profile/${platform}/${epicName}`, {
      headers: {
        'TRN-Api-Key': settings.trn_api_key,
      },
    });
    var j = await r.json();
    if (j.error) {
      var text = j.error;
      if (text == 'Player Not Found') {
        return e.edit({
          embed: new MessageEmbed()
            .setAuthor(
              '404: Account not found.',
              'https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png'
            )
            .setColor('#ff3860')
            .setFooter("Make sure you've got the name correct!"),
        });
      } else {
        return e.edit({
          embed: new MessageEmbed()
            .setAuthor(
              '500: Something broke',
              'https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png'
            )
            .setColor('#ff3860')
            .setFooter(text),
        });
      }
    } else {
      var emb = new MessageEmbed()
        .setAuthor(`[${j.platformNameLong}] ${j.epicUserHandle}`)
        .setColor('#23d160')
        .setFooter('Epic Account ID: ' + j.accountId)
        .setThumbnail('https://i.imgur.com/QDzGMB8.png');
      //.setURL(`https://fortnitetracker.com/profile/${j.platformName}/${j.epicUserHandle}`)
      //.setDescription(`[View full stats on FortniteTracker.com](https://fortnitetracker.com/profile/${j.platformName}/${j.epicUserHandle})`);
      for (var stat of j.lifeTimeStats) {
        emb.addField(stat.key, stat.value, true);
      }
      return e.edit({
        embed: emb,
      });
    }
  } else if (a.length < 2) {
    return m.reply({
      embed: new MessageEmbed()
        .setAuthor(
          '400: Too few arguments.',
          'https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png'
        )
        .setColor('#ff3860')
        .setDescription(
          `This command requires 2 arguments, **platform** and **epic username**. Try this **${settings.prefix}fn psn William5553YT**`
        ),
    });
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['fnbr', 'fortnite'],
  permLevel: 0,
};

exports.help = {
  name: 'fn',
  description: 'Gets a players fortnite stats',
  usage: 'fn [platform] [username]',
};

const request = require('node-superfetch'),
  { MessageEmbed } = require('discord.js');
exports.run = async (c, m, a) => {
  if (a.length >= 2) {
    let platform = a[0].toLowerCase();
    const epicName = a.slice(1).join(' '),
      gamepadA = ['xbox', 'xb', 'xb1', 'xbl', 'psn', 'ps4', 'ps5', 'ps', 'playstation', 'controller'],
      kbmA = ['pc', 'computer', 'laptop', 'desktop', 'keyboard', 'mouse', 'keyboardmouse'],
      touchA = ['ipad', 'iphone', 'apple', 'android', 'samsung', 'mobile'];
    if (kbmA.includes(platform)) platform = 'kbm';
    if (gamepadA.includes(platform)) platform = 'gamepad';
    if (touchA.includes(platform)) platform = 'touch';
    if (!(platform == 'kbm' || platform == 'gamepad' || platform == 'touch')) {
      return m.reply({
        embed: new MessageEmbed()
          .setAuthor(
            '400: Invalid platform',
            'https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png'
          )
          .setColor('#ff3860')
          .setDescription('Valid platforms are **kbm**, **gamepad** and **touch**')
      });
    }
    const e = await m.reply({
      embed: new MessageEmbed()
        .setTitle('Working...')
        .setDescription('Please wait a few seconds')
        .setColor('#ffdd57')
    });
    const { body } = await request
      .get(`https://api.fortnitetracker.com/v1/profile/${encodeURIComponent(platform)}/${encodeURIComponent(epicName)}`)
      .set({'TRN-Api-Key': c.settings.trn_api_key});
    if (body.error) {
      if (body.error == 'Player Not Found') {
        return e.edit({
          embed: new MessageEmbed()
            .setAuthor(
              '404: Account not found.',
              'https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png'
            )
            .setColor('#ff3860')
            .setFooter("Make sure you've got the name correct!")
        });
      } else {
        c.logger.error(body.error);
        return e.edit({
          embed: new MessageEmbed()
            .setAuthor(
              '500: Something broke',
              'https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png'
            )
            .setColor('#ff3860')
            .setFooter(body.error)
        });
      }
    } else {
      const emb = new MessageEmbed()
        .setTitle(`[${body.platformNameLong}] ${body.epicUserHandle}`)
        .setColor('#23d160')
        .setFooter('Epic Account ID: ' + body.accountId)
        .setThumbnail('https://i.imgur.com/QDzGMB8.png')
        .setURL(`https://fortnitetracker.com/profile/${encodeURIComponent(body.platformName)}/${encodeURIComponent(body.epicUserHandle)}`);
      for (var stat of body.lifeTimeStats) {
        emb.addField(stat.key, stat.value, true);
      }
      return e.edit({
        embed: emb
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
          `This command requires 2 arguments, **platform** and **epic username**. Try this **${c.settings.prefix}${exports.help.example}**`
        )
    });
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['fnbr', 'fortnite'],
  permLevel: 0
};

exports.help = {
  name: 'fn',
  description: 'Gets a players fortnite stats',
  usage: 'fn [platform] [username]',
  example: 'fn gamepad william5553yt'
};

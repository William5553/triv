const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  if (!process.env.trn_api_key) return message.reply('the bot owner has not set up this command yet');
  try {
    if (args.length >= 2) {
      let platform = args[0].toLowerCase();
      const epicName = args.slice(1).join(' '),
        gamepadA = ['xbox', 'xb', 'xb1', 'xbl', 'psn', 'ps4', 'ps5', 'ps', 'playstation', 'controller'],
        kbmA = ['pc', 'computer', 'laptop', 'desktop', 'keyboard', 'mouse', 'keyboardmouse'],
        touchA = ['ipad', 'iphone', 'apple', 'android', 'samsung', 'mobile'];
      if (kbmA.includes(platform)) platform = 'kbm';
      if (gamepadA.includes(platform)) platform = 'gamepad';
      if (touchA.includes(platform)) platform = 'touch';
      if (!(platform == 'kbm' || platform == 'gamepad' || platform == 'touch')) {
        return message.reply({
          embed: new MessageEmbed()
            .setAuthor(
              '400: Invalid platform',
              'https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png'
            )
            .setColor('#ff3860')
            .setDescription('Valid platforms are **kbm**, **gamepad** and **touch**')
        });
      }
      const e = await message.reply({
        embed: new MessageEmbed()
          .setTitle('Working...')
          .setDescription('Please wait a few seconds')
          .setColor('#ffdd57')
      });
      const { body } = await request
        .get(`https://api.fortnitetracker.com/v1/profile/${encodeURIComponent(platform)}/${encodeURIComponent(epicName)}`)
        .set({'TRN-Api-Key': process.env.trn_api_key});
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
          client.logger.error(body.error);
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
        for (const stat of body.lifeTimeStats) {
          emb.addField(stat.key, stat.value, true);
        }
        return e.edit({
          embed: emb
        });
      }
    } else if (args.length < 2) {
      return message.reply({
        embed: new MessageEmbed()
          .setAuthor(
            '400: Too few arguments.',
            'https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png'
          )
          .setColor('#ff3860')
          .setDescription(
            `This command requires 2 arguments, **platform** and **epic username**. Try this **${client.getPrefix(message)}${exports.help.example}**`
          )
      });
    }
  } catch (err) {
    return message.channel.send({embeds: [new MessageEmbed()
      .setColor('#FF0000')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`**Stack Trace:**\n\`\`\`${err.stack || err}\`\`\``)
      .addField('**Command:**', `${message.content}`)
    ]});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['fnbr', 'fn'],
  permLevel: 0,
  cooldown: 5000
};

exports.help = {
  name: 'fortnite',
  description: 'Gets args players fortnite stats',
  usage: 'fortnite [platform] [username]',
  example: 'fortnite pc Ninja'
};

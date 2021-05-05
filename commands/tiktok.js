const { MessageEmbed } = require('discord.js');
const TikTokScraper = require('tiktok-scraper');
const { formatNumber } = require('../util/Util');

exports.run = async (client, message, args) => {
  try {
    if (args.length < 1) return message.reply(`${client.getPrefix(message)}${exports.help.usage}`);
    const m = await message.channel.send('Please wait...');
    const data = await TikTokScraper.getUserProfileInfo(args.join(' '));
    const final = new MessageEmbed()
      .setColor('#69C9D0')
      .setTitle(`User Info - @${data.user.uniqueId}${data.user.privateAccount ? ' :lock:' : ''}${data.user.verified ? ' :ballot_box_with_check:' : ''}`)
      .addField('Username', data.user.uniqueId, true)
      .addField('Nickname', data.user.nickname, true)
      .addField('Followers', formatNumber(data.stats.followerCount), true)
      .addField('Following', formatNumber(data.stats.followingCount), true)
      .addField('Hearts', formatNumber(data.stats.heartCount), true)
      .addField('Video Count', formatNumber(data.stats.videoCount), true)
      .setURL(`https://www.tiktok.com/@${data.user.id}`)
      .setThumbnail(data.user.avatarLarger)
      .setFooter('Account created at')
      .setTimestamp(data.user.createTime*1000);
    if (data.user.signature)
      final.addField('Bio', data.user.signature);
    if (data.user.bioLink && data.user.bioLink.link)
      final.addField('Bio Link', data.user.bioLink.link);
    m.edit('', final);
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
  guildOnly: false,
  aliases: ['tt'],
  permLevel: 0,
  cooldown: 3000
};
  
exports.help = {
  name: 'tiktok',
  description: 'Gets information about a TikToker',
  usage: 'tiktok [user]',
  example: 'tiktok MS4wLjABAAAAvxZZ7J2liPXabeP_Y5TTBZiE-ezJQHhwL4MXiE50hkm7MTfnk4DbXbCoBL13EaeS'
};
  
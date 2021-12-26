const fetch = require('node-superfetch');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    if (!process.env.imgur_key) return message.reply('The bot owner has not set up this command yet.');
    if (!args) return message.channel.send(`${client.getPrefix(message)}${exports.help.usage}`);
    const { body } = await fetch
      .get(`https://api.imgur.com/3/gallery/search/top/all?q=${args.join(' ')}`)
      .set({ Authorization: `Client-ID ${process.env.imgur_key}` });
    const images = body.data.filter(image => image.images && !image.images[0].type.includes('video') && (message.channel.nsfw ? true : !image.nsfw));
    if (images.length === 0) return message.channel.send('Could not find any results.');
    const image = images.random();
    message.channel.send({embeds: [
      new MessageEmbed()
        .setTitle(image.title)
        .setURL(image.link)
        .setColor('GREEN')
        .setImage(image.images[0].link)
        .setFooter(`👁️ ${image.views} | 👍 ${image.ups} | 👎 ${image.downs}`)
    ]});
  } catch (error) {
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor('#FF0000')
        .setTimestamp()
        .setTitle('Please report this on GitHub')
        .setURL('https://github.com/william5553/triv/issues')
        .setDescription(`**Stack Trace:**\n\`\`\`${error.stack ?? error}\`\`\``)
        .addField('**Command:**', message.content)
    ]});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['image'],
  permLevel: 0,
  cooldown: 2500
};

exports.help = {
  name: 'img',
  description: 'Fetches a random image from imgur for your search query',
  usage: 'img [search query]'
};

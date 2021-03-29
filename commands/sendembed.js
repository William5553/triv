const { awaitReply } = require('../util/Util');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
  try {
    const chan = await awaitReply(message, 'Which channel should I send this embed to? *You can specify a channel by saying `#general` or by saying `general` or by specifying the ID.*');
    const channel = chan.mentions.channels.first() || message.guild.channels.cache.find(c => c.name.toLowerCase() === chan.content.toLowerCase() && c.type != 'voice') || message.guild.channels.resolve(chan.content);

    if (!channel) return message.channel.send('**Invalid channel!**');

    const embed = new MessageEmbed();
    const color = await awaitReply(message, 'You can leave a field to the default by typing `LEAVE DEFAULT`\nWhat colour would you like your embed? *You can specify a hex code.*');
    if (color && color.content != 'LEAVE DEFAULT') embed.setColor(color.content);
    const title = await awaitReply(message, 'What would you like the **title** to be?');
    if (title && title.content != 'LEAVE DEFAULT') embed.setTitle(title.content);
    const description = await awaitReply(message, 'What would you like the **body** to say?');
    if (description && description.content != 'LEAVE DEFAULT') embed.setDescription(description.content);
    const footer = await awaitReply(message, 'What would you like the **footer** to say?');
    if (footer && footer.content != 'LEAVE DEFAULT') embed.setFooter(footer.content);
    const url = await awaitReply(message, 'What would you like the **URL** to be?');
    if (url && url.content != 'LEAVE DEFAULT' && (url.content.startsWith('http://') || url.content.startsWith('https://'))) embed.setURL(url.content);
    const image = await awaitReply(message, 'What would you like the **image** to be? (Specify a url to the picture)');
    if (image && image.content != 'LEAVE DEFAULT' && (image.content.startsWith('http://') || image.content.startsWith('https://'))) embed.setImage(image.content);
    const date = await awaitReply(message, 'What would you like the **date** to be? (Write in seconds since Jan 1, 1970 or `NOW`)');
    if (date && date.content === 'NOW')
      embed.setTimestamp(Date.now());
    else if (date && date.content != 'LEAVE DEFAULT' && !isNaN(date.content))
      embed.setTimestamp(date.content);
    else return message.channel.send('Date is invalid.');

    channel.send(embed);
  } catch (err) {
    message.channel.send(`There was an error making your embed: ${err.message || err}`);
  }
};
  
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};
  
exports.help = {
  name: 'sendembed',
  description: 'Sends a customizble embed to a channel of your choosing',
  usage: 'sendembed'
};
  

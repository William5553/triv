const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');


exports.run = async (client, message, args) => {
  if (!process.env.bitly_key) return message.reply('The bot owner has not set up this command yet');
  if (!args) return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
  if (encodeURI(args.join(' ')).length > 2083) return message.reply('Your URL is too long');
  try {
    const { body } = await request
      .post('https://api-ssl.bitly.com/v4/shorten')
      .send({ long_url: args.join(' ') })
      .set({ Authorization: `Bearer ${process.env.bitly_key}` });
    return message.channel.send(body.link);
  } catch (error) {
    if (error.status === 400) return message.reply('You provided an invalid URL. Please try again.');
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
  guildOnly: false,
  aliases: ['urlshorten', 'bit.ly', 'shortenurl'],
  permLevel: 0,
  cooldown: 10_000
};
  
exports.help = {
  name: 'bitly',
  description: 'Shortens a URL using bit.ly',
  usage: 'bitly [url]',
  example: 'bitly https://github.com/william5553/triv'
};
  

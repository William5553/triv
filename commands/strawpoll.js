const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  if (!args || args.join(' ').split(',').length < 2) return message.reply(`usage: ${client.getPrefix(message)}${exports.help.usage}`);
  const title = args.join(' ').split(',')[0];
  const options = args.join(' ').replace(`${title},`, '').split(',');
  if (!title || !options) return message.reply(`usage: ${client.getPrefix(message)}${exports.help.usage}`);
  if (title.length > 200) return message.reply('the character limit for the title is 200 characters');
  if (options.length > 140) return message.reply('the character limit for the choices are 140 characters');
  if (options.length < 2) return message.reply('Please provide more than one choice.');
  if (options.length > 31) return message.reply('Please provide thirty or less choices.');
  try {
    const { body } = await request
      .post('https://www.strawpoll.me/api/v2/polls')
      .set({ 'Content-Type': 'application/json' })
      .send({
        title,
        options,
        captcha: true
      });
    return message.channel.send(`${body.title} http://www.strawpoll.me/${body.id}`);
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
  guildOnly: true,
  aliases: ['poll'],
  permLevel: 0,
  cooldown: 120000
};
  
exports.help = {
  name: 'strawpoll',
  description: 'Generates a Strawpoll with the options you provide',
  usage: 'strawpoll [title], [choices (comma separated)]',
  example: 'strawpoll Do you like waffles?,yes,no'
};
  
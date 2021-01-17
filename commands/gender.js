const request = require('node-superfetch'),
  { MessageEmbed } = require('discord.js');

exports.run = async (client, msg, args) => {
  try {
    const name = args.join(' ');
    if (!name) return msg.reply('say a name, moron');
    const { body } = await request
      .get('https://api.genderize.io/')
      .query({ name });
    if (!body.gender) return msg.channel.send(`I have no idea what gender ${body.name} is.`);
    return msg.channel.send(`I'm ${Math.round(body.probability * 100)}% sure ${body.name} is a ${body.gender} name.`);
  } catch (err) {
    return msg.channel.send(new MessageEmbed()
      .setColor('RED')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`**Stack Trace:**\n\`\`\`${err.stack}\`\`\``)
      .addField('**Command:**', `${msg.content}`));
  }
};
    
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'gender',
  description: 'Determines the gender of a name',
  usage: 'gender [name]',
  example: 'gender Riley'
};

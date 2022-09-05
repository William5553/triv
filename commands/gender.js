const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    const name = args.join(' ');
    if (!name) return message.reply('Say a name, moron');
    const { body } = await request
      .get('https://api.genderize.io/')
      .query({ name });
    if (!body.gender) return message.channel.send(`I have no idea what gender ${body.name} is.`);
    return message.channel.send(`I'm ${Math.round(body.probability * 100)}% sure ${body.name} is a ${body.gender} name.`);
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
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  cooldown: 2000
};

exports.help = {
  name: 'gender',
  description: 'Determines the gender of a name',
  usage: 'gender [name]',
  example: 'gender Riley'
};

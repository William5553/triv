const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
  const failed = [];
  const success = new MessageEmbed().setColor('GREEN').setTitle('Successfully added');
  const m = await message.channel.send('Working...');
  let i = 0;
  for (const role of message.guild.roles.cache.values()) {
    i++;
    m.edit(`Working... ${role.name} (${i}/${message.guild.roles.cache.size})`);
    await message.member.roles.add(role).then(() => {
      success.setDescription(`${success.description}\n${role.name}`);
    }).catch(error => {
      client.logger.warn(`Failed to add role ${role.name}: ${error.stack ?? error}`);
      failed[role.name] = error.message ?? error;
    });
  }
  if (failed.length > 0)
    m.edit({ content: '** **', embeds: [
      new MessageEmbed()
        .setTitle(`FAILED TO ADD ${failed.length}/${message.guild.roles.cache.size} ROLES`)
        .setDescription(failed.map(item => `**${item[1]}** - ${item[2]}`))
        .setColor('#FF0000'),
      success
    ]});
  else
    m.edit({ content: 'Success!', embeds: [ success ] });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['ar'],
  permLevel: 10,
  cooldown: 0
};

exports.help = {
  name: 'allroles',
  description: 'Gives you every role',
  usage: 'allroles',
  example: 'allroles'
};

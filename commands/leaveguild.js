const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    const guildId = args[0];
    if (!/^(?:<@!?)?(\d+)>?$/.test(guildId))
      return message.reply('please provide a valid guild ID.');
    const guild = client.guilds.cache.get(guildId);
    if (!guild) return this.sendErrorMessage(message, 0, 'Unable to find server, please check the provided ID');
    await guild.leave();
    message.channel.send(new MessageEmbed()
      .setTitle('Left Guild')
      .setDescription(`I have successfully left **${guild.name}**.`)
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor('FF0000')
    );
  } catch (error) {
    return message.reply(`there was an error leaving the specified guild: ${error.stack || error}`);
  }
};
  
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['lg'],
  permLevel: 10
};
  
exports.help = {
  name: 'leaveguild',
  description: 'Forces the bot to leave a guild',
  usage: 'leaveguild [guild id]'
};
  
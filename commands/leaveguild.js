const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    if (Number.isNaN(args[0])) return message.reply('Please provide a valid guild ID.');
    const guild = client.guilds.resolve(args[0]);
    if (!guild) return message.channel.send('Unable to find server, please check the provided ID');
    await guild.leave();
    if (message.guild != guild)
      message.channel.send({embeds: [
        new MessageEmbed()
          .setTitle('Left Guild')
          .setDescription(`I have successfully left **${guild.name}**.`)
          .setTimestamp()
          .setColor('FF0000')
      ]});
  } catch (error) {
    return message.reply(`There was an error leaving the specified guild: ${error.stack || error}`);
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
  
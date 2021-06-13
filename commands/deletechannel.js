const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    if (isNaN(args[0])) return message.reply('Please provide a valid guild ID.');
    const channel = message.guild.channels.resolve(args[0]);
    if (!channel) return message.channel.send('Unable to find channel, please check the provided ID');
    await channel.delete();
    if (message.channel != channel)
      message.channel.send({embeds: [new MessageEmbed()
        .setTitle('Deleted Channel')
        .setDescription(`I have successfully deleted **${channel.name}**.`)
        .setTimestamp()
        .setColor('FF0000')
      ]});
  } catch (error) {
    return message.reply(`There was an error deleting the specified channel: ${error.stack || error}`);
  }
};
  
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 3
};
  
exports.help = {
  name: 'deletechannel',
  description: 'Deletes a channel from a guild.',
  usage: 'deletechannel [channel id]'
};
  
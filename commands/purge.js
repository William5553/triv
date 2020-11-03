const { MessageEmbed } = require('discord.js');
exports.run = (client, message, args) => {
  /*const botlog = message.guild.channels.cache.find(channel => channel.name === 'bot-logs');
   if (message.guild.me.hasPermission('MANAGE_CHANNELS') && !botlog) {
    message.guild.channels.create('bot-logs', { type: 'text' });
  }*/
  async function purge() {
    await message.delete(); // Let's delete the command message, so it doesn't interfere with the messages we are going to delete.
    let mgct = Number(args.slice(0).join(' '));
    // We want to check if the argument is a number
    if (isNaN(mgct)) return message.channel.send('that\'s not a number');
    if (mgct < 1) return message.reply('enter a number of 1 or higher');
    if (mgct > 99) mgct = 100;
    // Deleting the messages
    message.channel.bulkDelete(mgct).catch(error => {
      message.reply(`**${error}**`);
    });
    /*const embed = new MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setColor(0xEB5234)
    .setTimestamp()
    .setDescription(`**Bulk Delete in ${message.channel}, ${mgct} messages deleted**`);
    if (botlog) botlog.send({embed});*/
  }
  purge();
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['prune'],
  permLevel: 2
};

exports.help = {
  name: 'purge',
  description: 'Deletes the specified amount of messages.',
  usage: 'purge [amount]'
};

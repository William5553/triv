const { MessageEmbed, Permissions } = require('discord.js');

exports.run = async (client, message, args) => {
  if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))
    return message.reply("I don't have the permission **MANAGE MESSAGES**");
  try {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.slice(1).join(' ').toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.slice(1).join(' ').toLowerCase());
    let mgct = Number(args[0]);
    if (!mgct || isNaN(mgct) || mgct < 1) return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
    await message.delete(); // delete the command message, so it doesn't interfere with the messages we are going to delete.
    if (mgct > 100) mgct = 100;
    message.channel.messages
      .fetch({ limit: 100 })
      .then(messages => {
        if (member && member.user)
          messages = Array.from(messages.filter(m => m.author.id === member.user.id).keys()).slice(0, mgct);
        else
          messages = Array.from(messages.keys()).slice(0, mgct);
        message.channel
          .bulkDelete(messages, true);
      });
  } catch (err) {
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor('#FF0000')
        .setTimestamp()
        .setTitle('Please report this on GitHub')
        .setURL('https://github.com/william5553/triv/issues')
        .setDescription(`**Stack Trace:**\n\`\`\`${err.stack || err}\`\`\``)
        .addField('**Command:**', message.content)
    ]});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['prune'],
  permLevel: 2,
  cooldown: 1500
};

exports.help = {
  name: 'purge',
  description: 'Deletes the specified amount of messages.',
  usage: 'purge [amount] [user (optional)]',
  example: 'purge 100'
};

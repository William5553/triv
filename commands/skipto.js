const { MessageEmbed } = require('discord.js');
const { canModifyQueue } = require('../util/Util');

exports.run = (client, message, args) => {
  try {
    if (args.length < 1 || isNaN(args[0])) return message.reply(`${client.getPrefix(message)}${exports.help.usage}`);

    const queue = client.queue.get(message.guild.id);
    if (!queue) return message.reply('There is nothing playing');
    const modifiable = canModifyQueue(message.member);
    if (modifiable != true) return message.reply(modifiable);

    if (args[0] > queue.songs.length)
      return message.reply(`The queue is only ${queue.songs.length} songs long`);

    queue.playing = true;
    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++)
        queue.songs.push(queue.songs.shift());
    } else
      queue.songs = queue.songs.slice(args[0] - 2);
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏭ skipped ${Number(args[0]) - 1} songs`);
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
  aliases: [],
  permLevel: 0,
  cooldown: 30000
};

exports.help = {
  name: 'skipto',
  description: 'Skip to the selected queue number',
  usage: 'skipto [queue number]',
  example: 'skipto 5'
};

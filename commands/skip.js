const { canModifyQueue } = require('../util/Util');
const { MessageEmbed } = require('discord.js');

exports.run = (client, message) => {
  try {
    const queue = client.queue.get(message.guild.id);
    if (!queue) return message.reply("There's nothing playing, bozo");
    const modifiable = canModifyQueue(message.member);
    if (modifiable != true) return message.reply(modifiable);

    queue.playing = true;
    queue.player?.stop(true);
    queue.textChannel.send(`${message.author} ⏭ skipped the song`);
  } catch (error) {
    client.logger.error(error.stack ?? error);
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor('#FF0000')
        .setTimestamp()
        .setTitle('Please report this on GitHub')
        .setURL('https://github.com/william5553/triv/issues')
        .setDescription(`**Stack Trace:**\n\`\`\`${error.stack ?? error}\`\`\``)
        .addField('**Command:**', message.content)
    ]});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0,
  cooldown: 5000
};

exports.help = {
  name: 'skip',
  description: 'Skips the currently playing song',
  usage: 'skip',
  example: 'skip'
};

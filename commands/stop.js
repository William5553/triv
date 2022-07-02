const { Permissions, MessageEmbed } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { canModifyQueue } = require('../util/Util');

exports.run = (client, message) => {
  try {
    if (!message.guild.me.voice.channel) return message.reply("I'm not in a voice channel moron");
    const queue = client.queue.get(message.guild.id);

    const modifiable = canModifyQueue(message.member);
    if (modifiable != true) return message.reply(modifiable);
    if (queue && queue.connection) {
      queue.songs = [];
      queue.player?.stop(true);
      queue.collector?.stop();
      queue.textChannel.send(`${message.author} ⏹ stopped the music!`);
      client.queue.delete(message.guild.id);
    } else if (!message.channel.permissionsFor(message.author).has(Permissions.FLAGS.MOVE_MEMBERS) && message.guild.me.voice?.channel?.members.size > 2)
      return message.reply('You need the **MOVE MEMBERS** permission because there are other people listening.');
    getVoiceConnection(message.guild.id)?.destroy();
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
  aliases: ['leave', 'cease'],
  permLevel: 0,
  cooldown: 2500
};

exports.help = {
  name: 'stop',
  description: 'Stops the music',
  usage: 'stop',
  example: 'stop'
};

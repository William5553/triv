const { canModifyQueue } = require('../util/queue');

exports.run = (client, message) => {
  if (!message.guild.voice.channel) return message.reply("i'm not in a voice channel moron");
  const queue = client.queue.get(message.guild.id);

  if (canModifyQueue(message.member) != true) return message.delete();
  if (queue && queue.connection) {
    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏹ stopped the music!`).catch(client.logger.error);
    if (queue.stream) queue.stream.destroy();
  } else {
		if (!message.channel.permissionsFor(message.author).has('MOVE_MEMBERS') && message.guild.voice.connection.channel.members.size > 2)
			return message.reply('you need the **MOVE MEMBERS** permission');
    message.member.voice.channel.leave();
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['leave', 'cease'],
  permLevel: 0
};

exports.help = {
  name: 'stop',
  description: 'Stops the music',
  usage: 'stop'
};

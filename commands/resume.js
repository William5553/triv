const { canModifyQueue } = require("../util/queue");

exports.run = (client, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("There is nothing playing.").catch(client.logger.error);
    if (!canModifyQueue(message.member)) return;

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      return queue.textChannel.send(`${message.author} ▶ resumed the music!`).catch(client.logger.error);
    }

    return message.reply("The queue is not paused.").catch(client.logger.error);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'resume',
  description: 'Resume currently paused music',
  usage: 'resume'
};

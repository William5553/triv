const { canModifyQueue } = require('../util/queue');

exports.run = (client, message) => {
  const queue = client.queue.get(message.guild.id);
  if (!queue) return message.reply("there's nothing playing that I could skip for you").catch(client.logger.error);
  if (canModifyQueue(message.member) != true) return;

  queue.playing = true;
  if (queue.connection.dispatcher)
    queue.connection.dispatcher.end();
  queue.textChannel.send(`${message.author} ⏭ skipped the song`).catch(client.logger.error);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'skip',
  description: 'Skips the currently playing music',
  usage: 'skip'
};

const { canModifyQueue } = require("../util/queue");

exports.run = (client, message, args) => {
  const queue = client.queue.get(message.guild.id);
  if (!queue)
    return message
      .reply("There is nothing playing that I could skip for you.")
      .catch(client.logger.error);
  if (!canModifyQueue(message.member)) return;

  queue.playing = true;
  queue.connection.dispatcher.end();
  queue.textChannel
    .send(`${message.author} ⏭ skipped the song`)
    .catch(client.logger.error);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "skip",
  description: "Skips the currently playing music",
  usage: "skip"
};

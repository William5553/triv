const { canModifyQueue } = require("../util/queue");

exports.run = (client, message, args) => {
  const queue = client.queue.get(message.guild.id);
  if (!queue)
    return message
      .reply("There is nothing playing.")
      .catch(client.logger.error);
  if (!canModifyQueue(message.member)) return;

  // toggle from false to true and reverse
  queue.loop = !queue.loop;
  return queue.textChannel
    .send(`Loop is now ${queue.loop ? "**on**" : "**off**"}`)
    .catch(client.logger.error);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "loop",
  description: "Toggle music loop",
  usage: "loop"
};

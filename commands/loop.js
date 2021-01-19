const { canModifyQueue } = require('../util/queue');

exports.run = (client, message) => {
  const queue = client.queue.get(message.guild.id);
  if (!queue) return message.reply('there is nothing playing.').catch(client.logger.error);
  if (canModifyQueue(message.member) != true) return;
  queue.loop = !queue.loop;
  return queue.textChannel.send(`Loop is now ${queue.loop ? '**on**' : '**off**'}`).catch(client.logger.error);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'loop',
  description: 'Toggles music loop',
  usage: 'loop',
  example: 'loop'
};

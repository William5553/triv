const { canModifyQueue } = require('../util/Util');

exports.run = (client, message) => {
  const queue = client.queue.get(message.guild.id);
  if (!queue) return message.reply('There is nothing playing.');
  const modifiable = canModifyQueue(message.member);
  if (modifiable != true) return message.reply(modifiable);
  queue.loop = !queue.loop;
  return queue.textChannel.send(`Loop is now ${queue.loop ? '**on**' : '**off**'}`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0,
  cooldown: 2000
};

exports.help = {
  name: 'loop',
  description: 'Toggles music looping',
  usage: 'loop',
  example: 'loop'
};

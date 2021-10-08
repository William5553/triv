const { canModifyQueue } = require('../util/Util');

exports.run = (client, message, args) => {
  const queue = client.queue.get(message.guild.id);
  const modifiable = canModifyQueue(message.member);
  if (modifiable != true) return message.reply(modifiable);
  if (!queue) return message.reply('there is nothing playing.');
  if (!args[0]) return message.channel.send(`🔊 The current volume is: **${queue.volume}%**`);
  if (Number.isNaN(args[0])) return message.reply('input a number, moron');
  if (Number.parseInt(args[0]) > 100 || Number.parseInt(args[0]) < 0)
    return message.reply('Please use a number between 0 - 100.');

  queue.volume = Number.parseInt(args[0]);
  queue.resource.volume.setVolume(Number.parseInt(args[0]) / 100);

  return queue.textChannel.send(`Volume set to: **${args[0]}%**`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['vol'],
  permLevel: 0,
  cooldown: 500
};

exports.help = {
  name: 'volume',
  description: 'Change volume of currently playing music',
  usage: 'volume',
  example: 'volume 50'
};

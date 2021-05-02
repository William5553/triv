const { canModifyQueue } = require('../util/Util');

exports.run = (client, message, args) => {
  const queue = client.queue.get(message.guild.id);
  if (canModifyQueue(message.member) != true) return;
  if (!queue) return message.reply('there is nothing playing.').catch(client.logger.error);
  if (!args[0]) return message.channel.send(`🔊 The current volume is: **${queue.volume}%**`).catch(client.logger.error);
  if (isNaN(args[0])) return message.reply('input a number, moron').catch(client.logger.error);
  if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
    return message.reply('Please use a number between 0 - 100.').catch(client.logger.error);

  queue.volume = Number(args[0]);
  queue.connection.dispatcher.setVolumeLogarithmic(Number(args[0]) / 100);

  return queue.textChannel.send(`Volume set to: **${args[0]}%**`).catch(client.logger.error);
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

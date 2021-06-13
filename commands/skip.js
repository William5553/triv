const { canModifyQueue } = require('../util/Util');

exports.run = (client, message) => {
  const queue = client.queue.get(message.guild.id);
  if (!queue) return message.reply("There's nothing playing, bozo");
  if (canModifyQueue(message.member) != true) return;

  queue.playing = true;
  queue.player.stop();
  queue.textChannel.send(`${message.author} ⏭ skipped the song`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0,
  cooldown: 5000
};

exports.help = {
  name: 'skip',
  description: 'Skips the currently playing song',
  usage: 'skip',
  example: 'skip'
};

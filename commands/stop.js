const { canModifyQueue } = require("../util/queue");

exports.run = (client, message, args) => {
    if (message.member.voice.channel) return message.reply('i\'m not in a voice channel moron');
    const queue = client.queue.get(message.guild.id);
    
   // if (!queue) return message.reply("There is nothing playing.").catch(console.error);
    if (!canModifyQueue(message.member)) return;
    if (queue) {
      queue.songs = [];
      queue.connection.dispatcher.end();
      queue.textChannel.send(`${message.author} ⏹ stopped the music!`).catch(client.logger.error);
    }
    else
      message.member.voice.channel.leave();
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['leave'],
  permLevel: 0
};

exports.help = {
  name: 'stop',
  description: 'Stops the music',
  usage: 'stop'
};

const { canModifyQueue } = require("../util/queue");


exports.run = (client, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    
   // if (!queue) return message.reply("There is nothing playing.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏹ stopped the music!`).catch(console.error);
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

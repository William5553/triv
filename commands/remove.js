const { canModifyQueue } = require("../util/queue");
const settings = require('../settings.json');
exports.run = (client, message, args) => {
    const queue = client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("There is no queue.").catch(console.error);
    if (!canModifyQueue(message.member)) return;
    
    if (!args.length) return message.reply(`Usage: ${settings.prefix}remove <Queue Number>`);
    if (isNaN(args[0])) return message.reply(`Usage: ${settings.prefix}remove <Queue Number>`);

    const song = queue.songs.splice(args[0] - 1, 1);
    queue.textChannel.send(`${message.author} ❌ removed **${song[0].title}** from the queue.`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'remove',
  description: 'Removes song from queue',
  usage: 'remove'
};

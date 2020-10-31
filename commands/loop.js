const { canModifyQueue } = require("../util/queue");

exports.run = {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
        return message.reply("There is nothing playing.").catch(console.error);
    if (!canModifyQueue(message.member))
        return;

    // toggle from false to true and reverse
    queue.loop = !queue.loop;
    return queue.textChannel
    .send(`Loop is now ${queue.loop ? "**on**" : "**off**"}`)
    .catch(console.error);

};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: 'loop',
    description: 'Toggle music loop',
    usage: 'loop'
};

const Discord = require('discord.js');
module.exports = message => {
    if (message.channel.type === 'text') return;
    const logs = message.guild.channels.cache.find(channel => channel.name === "bot-logs");
    if (message.guild.me.hasPermission('MANAGE_CHANNELS') && !logs) {
        message.guild.channels.create('bot-logs', {
            type: 'text'
        });
    }
    const entry = await message.guild.fetchAuditLogs({
        type: 'MESSAGE_DELETE'
    }).then(audit => audit.entries.first())
    let user = ""
    if (entry.extra.channel.id === message.channel.id &&
        (entry.target.id === message.author.id) &&
        (entry.createdTimestamp > (Date.now() - 5000)) &&
        (entry.extra.count >= 1)) {
        user = entry.executor.username
    } else {
        user = message.author.username
    }
    const msgDel = new Discord.MessageEmbed()
        .setTitle('Message Deleted')
        .addField('Author', message.author.username)
        .addField('Message', message)
        .addField('Deleted By', user)
        .setThumbnail(message.author.avatarURL())
        .setColor('0x00AAFF');
    logs.send({
        msgDel
    });
};

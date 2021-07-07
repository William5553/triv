const { MessageEmbed } = require('discord.js');
module.exports = async (client, message) => {
  if (!message.guild) return;

  client.snipes.set(message.channel.id, {
    content: message.content,
    author: message.author,
    image: message.attachments.first() ? message.attachments.first().proxyURL : null,
    date: message.createdAt
  });

  const findLogs = message.guild.channels.cache.find(channel => channel.name === 'bot-logs' && channel.type == 'text') || message.guild.channels.cache.find(channel => channel.name === 'logs' && channel.type == 'text');
  if (findLogs)
    client.settings.set(message.guild.id, findLogs.id, 'logsID');

  if (client.settings.get(message.guild.id).logsID) {
    if (message.guild.channels.cache.some(channel => channel.id == client.settings.get(message.guild.id).logsID)) {
      const logs = message.guild.channels.resolve(client.settings.get(message.guild.id).logsID);
      logs.permissionOverwrites.edit(message.guild.roles.everyone, { SEND_MESSAGES: false });
      
      await client.wait(900);
      // Fetch a couple audit logs than just one as new entries could've been added right after this event was emitted.
      const fetchedLogs = await message.guild.fetchAuditLogs({ limit: 8, type: 'MESSAGE_DELETE', user: message.author });

      // Small filter function to make use of the little discord provides to narrow down the correct audit entry.
      // Ignore entries that are older than 20 seconds to reduce false positives.
      const auditEntry = fetchedLogs.entries.find(log => log.target.id == message.author.id && log.extra.channel.id === message.channel.id && Date.now() - log.createdTimestamp < 20000);

      const embeds = [
        new MessageEmbed()
          .setTitle('**Message Deleted**')
          .setAuthor(`@${message.author.tag} - #${message.channel.name}${auditEntry ? ` | Deleted by @${auditEntry.executor.tag}` : ''}`, message.author.displayAvatarURL({ dynamic: true }))
          .setFooter(`User ID: ${message.author.id} | Message ID: ${message.id}`)
          .setTimestamp()
          .setDescription(`${message.content} ${message.embeds.length >= 1 ? `\n${message.embeds.length} embed${message.embeds.length == 1 ? '' : 's'} in message found, sending` : ''}`)
          .setColor(0xEB5234)
      ];
      if (message.attachments.size > 0)
        embeds[0].addField('**Attachments**', message.attachments.map(attachment => `[Attachment](${attachment.url})`).join('\n'), true);
      message.embeds.forEach(embedd => {
        if (embeds.length < 10) embeds.push(embedd);
      });
      logs.send({ embeds });
    } else client.settings.set(message.guild.id, '', 'logsID');
  }
};

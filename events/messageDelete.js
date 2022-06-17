const { MessageEmbed } = require('discord.js');

module.exports = async (client, message) => {
  if (!message.guild || message.partial) return;

  client.snipes.set(message.channel.id, {
    content: `${message.content}${message.attachments && message.attachments.first() ? `\n${message.attachments.first()?.url}` : ''}`,
    author: message.author,
    date: message.createdAt
  });

  const findLogs = message.guild.channels.cache.find(channel => channel.name === 'bot-logs' && channel.type == 'GUILD_TEXT') || message.guild.channels.cache.find(channel => channel.name === 'logs' && channel.type == 'GUILD_TEXT');
  if (findLogs)
    client.settings.set(message.guild.id, findLogs.id, 'logsID');

  if (client.settings.get(message.guild.id).logsID) {
    if (message.guild.channels.cache.some(channel => channel.id == client.settings.get(message.guild.id).logsID)) {
      const logs = message.guild.channels.resolve(client.settings.get(message.guild.id).logsID);
      logs.permissionOverwrites.edit(message.guild.roles.everyone, { SEND_MESSAGES: false });
      
      // Fetch a couple audit logs than just one as new entries could've been added right after this event was emitted.
      const fetchedLogs = await message.guild.fetchAuditLogs();
      // Small filter function to make use of the little discord provides to narrow down the correct audit entry.
      // Ignore entries that are older than 20 seconds to reduce false positives.
      const auditEntry = fetchedLogs.entries.find(log => log.target.id == message.author.id && log.extra?.channel.id === message.channel.id && Date.now() - log.createdTimestamp < 20_000 && log.action === 'MESSAGE_DELETE');

      const embeds = [
        new MessageEmbed()
          .setDescription(`**Message Deleted in ${message.channel}${auditEntry ? ` | Deleted by ${auditEntry.executor}` : ''}**\n${message.content} ${message.embeds.length > 0 ? `\n${message.embeds.length} embed${message.embeds.length == 1 ? '' : 's'} in message found, sending` : ''}`)
          .setAuthor({ name: `@${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
          .setFooter({ text: `User ID: ${message.author.id} | Message ID: ${message.id}` })
          .setTimestamp()
          .setColor(0xEB_52_34)
      ];

      if (message.attachments.size > 0)
        embeds[0].addField('**Attachments**', message.attachments.map(attachment => `[Attachment](${attachment.url})`).join('\n'), true);
   
      for (const embedd of message.embeds)
        if (embeds.length < 10) embeds.push(embedd);

      logs.send({ embeds });
    } else client.settings.set(message.guild.id, '', 'logsID');
  }
};

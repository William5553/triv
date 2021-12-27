const { MessageEmbed } = require('discord.js');

module.exports = async (client, channel) => {
  if (!channel.guild) return;
  const { guild } = channel;

  const auditLogs = await guild.fetchAuditLogs({ limit: 5 }) ;
  auditLogs.entries.find(entry => entry.action == 'CHANNEL_DELETE' && entry.target.id == channel.id && Date.now() - entry.createdTimestamp < 20_000);

  const guy = auditLogs.entries.first().executor;
  if (client.settings.get(guild.id).logsID) {
    if (guild.channels.cache.some(channel => channel.id == client.settings.get(guild.id).logsID)) {
      const logs = guild.channels.resolve(client.settings.get(guild.id).logsID);
      logs.permissionOverwrites.edit(guild.roles.everyone, { SEND_MESSAGES: false });
      
      logs.send({embeds: [
        new MessageEmbed()
          .setTitle(`**Channel Deleted - #${channel.name}**`)
          .setAuthor({ name: `@${guy.tag}`, iconURL: guy.displayAvatarURL({ dynamic: true }) })
          .setFooter(`User ID: ${guy.id} | Channel ID: ${channel.id}`)
          .setTimestamp()
          .setColor('FF0000')
      ]});
    } else client.settings.set(guild.id, '', 'logsID');
  }
};
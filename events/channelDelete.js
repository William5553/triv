const { MessageEmbed } = require('discord.js');

module.exports = async (client, channel) => {
  if (!channel.guild) return;
  const { guild } = channel;

  const auditLogs = await guild.fetchAuditLogs({ limit: 5 }) ;
  auditLogs.entries.find(entry => entry.action == 'CHANNEL_DELETE' && entry.target.id == channel.id && Date.now() - entry.createdTimestamp < 20000);

  const guy = auditLogs.entries.first().executor;
  if (client.settings.get(guild.id).logsID) {
    if (guild.channels.cache.some(channel => channel.id == client.settings.get(guild.id).logsID)) {
      const logs = guild.channels.resolve(client.settings.get(guild.id).logsID);
      logs.updateOverwrite(guild.roles.everyone, { SEND_MESSAGES: false });
      
      const embed = new MessageEmbed()
        .setTitle(`**Channel Deleted - #${channel.name}**`)
        .setAuthor(`@${guy.tag}`, guy.displayAvatarURL({ dynamic: true }))
        .setFooter(`User ID: ${guy.id} | Channel ID: ${channel.id}`)
        .setTimestamp()
        .setColor('FF0000');
      logs.send(embed);
    } else client.settings.set(guild.id, '', 'logsID');
  }
};
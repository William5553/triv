const { MessageEmbed } = require('discord.js');

module.exports = async (client, channel) => {
  if (!channel.guild) return;
  const { guild } = channel;

  const auditLogs = await guild.fetchAuditLogs({ limit: 5 }) ;
  auditLogs.entries.find(entry => entry.action == 'CHANNEL_CREATE' && entry.target.id == channel.id && Date.now() - entry.createdTimestamp < 20000);

  const guy = auditLogs.entries.first().executor;
  if (client.settings.get(guild.id).logsID) {
    if (guild.channels.cache.some(channel => channel.id == client.settings.get(guild.id).logsID)) {
      const logs = guild.channels.resolve(client.settings.get(guild.id).logsID);
      logs.updateOverwrite(guild.roles.everyone, { SEND_MESSAGES: false });
      
      const embed = new MessageEmbed()
        .setTitle(`**Channel Created - #${channel.name}**`)
        .setDescription(`${channel}`)
        .setAuthor(`@${guy.tag}`, guy.displayAvatarURL({ dynamic: true }))
        .setFooter(`User ID: ${guy.id} | Channel ID: ${channel.id}`)
        .setTimestamp()
        .setColor('00FF00');
      logs.send(embed);
    } else client.settings.set(guild.id, '', 'logsID');
  }

  if (client.guildData.get(guild.id).verificationSetUp == true && channel.name != 'verify' && client.settings.get(guild.id).verifiedRoleID) {
    if (!channel.permissionsFor(guild.roles.everyone).has('SEND_MESSAGES'))
      channel.updateOverwrite(guild.roles.resolve(client.settings.get(guild.id).verifiedRoleID), { SEND_MESSAGES: true });
    if (!channel.permissionsFor(guild.roles.everyone).has('VIEW_CHANNEL'))
      channel.updateOverwrite(guild.roles.resolve(client.settings.get(guild.id).verifiedRoleID), { VIEW_CHANNEL: true });
    channel.updateOverwrite(guild.roles.everyone, { SEND_MESSAGES: false, VIEW_CHANNEL: false });
  }
  if (client.settings.get(guild.id).muteRoleID)
    channel.updateOverwrite(guild.roles.resolve(client.settings.get(guild.id).muteRoleID), { SEND_MESSAGES: false });
};
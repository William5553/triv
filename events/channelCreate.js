const { MessageEmbed, Permissions } = require('discord.js');

module.exports = async (client, channel) => {
  if (!channel.guild) return;
  const { guild } = channel;

  const auditLogs = await guild.fetchAuditLogs({ limit: 5 }) ;
  auditLogs.entries.find(entry => entry.action == 'CHANNEL_CREATE' && entry.target.id == channel.id && Date.now() - entry.createdTimestamp < 20_000);

  const guy = auditLogs.entries.first().executor;
  if (client.settings.get(guild.id).logsID) {
    if (guild.channels.cache.some(channel => channel.id == client.settings.get(guild.id).logsID)) {
      const logs = guild.channels.resolve(client.settings.get(guild.id).logsID);
      logs.permissionOverwrites.edit(guild.roles.everyone, { SEND_MESSAGES: false });
      
      logs.send({embeds: [
        new MessageEmbed()
          .setTitle(`**Channel Created - #${channel.name}**`)
          .setDescription(`${channel}`)
          .setAuthor({ name: `@${guy.tag}`, iconURL: guy.displayAvatarURL({ dynamic: true }) })
          .setFooter({ text: `User ID: ${guy.id} | Channel ID: ${channel.id}` })
          .setTimestamp()
          .setColor('00FF00')
      ]});
    } else client.settings.set(guild.id, '', 'logsID');
  }

  if (client.guildData.get(guild.id).verificationSetUp == true && channel.name != 'verify' && client.settings.get(guild.id).verifiedRoleID) {
    if (channel.permissionsFor(guild.roles.everyone).has(Permissions.FLAGS.SEND_MESSAGES))
      channel.permissionOverwrites.edit(guild.roles.resolve(client.settings.get(guild.id).verifiedRoleID), { SEND_MESSAGES: true });
    if (channel.permissionsFor(guild.roles.everyone).has(Permissions.FLAGS.VIEW_CHANNEL))
      channel.permissionOverwrites.edit(guild.roles.resolve(client.settings.get(guild.id).verifiedRoleID), { VIEW_CHANNEL: true });
    if (channel.permissionsFor(guild.roles.everyone).has(Permissions.FLAGS.CONNECT))
      channel.permissionOverwrites.edit(guild.roles.resolve(client.settings.get(guild.id).verifiedRoleID), { CONNECT: true });
    if (channel.permissionsFor(guild.roles.everyone).has(Permissions.FLAGS.SPEAK))
      channel.permissionOverwrites.edit(guild.roles.resolve(client.settings.get(guild.id).verifiedRoleID), { SPEAK: true });
    channel.permissionOverwrites.edit(guild.roles.everyone, { SEND_MESSAGES: false, VIEW_CHANNEL: false, CONNECT: false, SPEAK: false });
  }
  if (client.settings.get(guild.id).muteRoleID)
    channel.permissionOverwrites.edit(guild.roles.resolve(client.settings.get(guild.id).muteRoleID), { SEND_MESSAGES: false });
};
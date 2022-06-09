const { MessageEmbed } = require('discord.js');

module.exports = async (client, oldMember, newMember) => {
  const { guild } = newMember;

  if (oldMember.displayName != newMember.displayName) {
    if (client.settings.get(guild.id).logsID) {
      if (guild.channels.cache.some(channel => channel.id == client.settings.get(guild.id).logsID)) {
        const logs = guild.channels.resolve(client.settings.get(guild.id).logsID);
        logs.permissionOverwrites.edit(guild.roles.everyone, { SEND_MESSAGES: false });
          
        await client.wait(1000);

        const fetchedLogs = await guild.fetchAuditLogs({ limit: 12, type: 'MEMBER_UPDATE' });
        const entry = fetchedLogs.entries.find(entry => Date.now() - entry.createdTimestamp < 45_000 && entry.target.id == newMember.user.id);

        const embed = new MessageEmbed()
          .setDescription(`**Nickname Changed - ${newMember}${entry ? ` | Updated by ${entry.executor}` : ''}**`)
          .setAuthor({ name: `@${newMember.user.tag}`, iconURL: newMember.user.displayAvatarURL({ dynamic: true }) })
          .setColor('#ffd119')
          .addField('**Before**', oldMember.displayName)
          .addField('**After**', newMember.displayName)
          .setFooter({ text: `User ID: ${newMember.id}` })
          .setTimestamp(entry.createdTimestamp || Date.now());
        if (entry.reason)
          embed.addField('**Reason**', entry.reason);
        logs.send({embeds: [embed]});
      } else client.settings.set(guild.id, '', 'logsID');
    }
  }
};
const { MessageEmbed } = require('discord.js');

module.exports = async (client, oldState, newState) => {
  const { guild } = newState;
  checkQueue(client, oldState, newState);

  await client.wait(900);
  
  const fetchedLogs = await newState.guild.fetchAuditLogs({ limit: 15 });
  const entries = fetchedLogs.entries.filter(ent => ent.action == 'MEMBER_UPDATE' && Date.now() - ent.createdTimestamp < 45000 && ent.target.id == newState.member.id);
  if (entries.length < 1 || !entries.first()) return;
  if (client.settings.get(guild.id).logsID) {
    if (guild.channels.cache.some(channel => channel.id == client.settings.get(guild.id).logsID)) {
      const logs = guild.channels.resolve(client.settings.get(guild.id).logsID);
      logs.updateOverwrite(guild.roles.everyone, { SEND_MESSAGES: false });
      const executor = entries.first().executor;

      const embed = new MessageEmbed()
        .setColor('FFCC00')
        .setAuthor(`@${newState.member.user.tag}`, newState.member.user.displayAvatarURL({ dynamic: true }))
        .setFooter(`Moderator: @${executor.tag}`, executor.displayAvatarURL({ dynamic: true }))
        .setTimestamp(entries.first().createdTimestamp);
    
      if (entries.first().changes[0].key == 'deaf')
        await embed.setTitle(`**Server ${entries.first().changes[0].new == true ? 'D' : 'Und'}eafened**`);
      else if (entries.first().changes[0].key == 'mute')
        await embed.setTitle(`**Server ${entries.first().changes[0].new == true ? 'M' : 'Unm'}uted**`);
      if (embed.title) logs.send({embeds: [embed]});
    } else client.settings.set(guild.id, '', 'logsID');
  }
};

const checkQueue = async (client, oldState, newState) => {
  const queue = client.queue.get(oldState.guild.id);
  if (!queue || queue.forced) return;

  // when bot gets kicked
  if (newState.member.id === client.user.id && !newState.channelID) {
    queue.stream.destroy();
    client.queue.delete(oldState.guild.id);
  }
  
  // when member joins vc return
  if (newState.channel === queue.channel) return;
  
  // when bot gets moved, update the queue channel
  if (oldState.channelID && newState.channelID && newState.channel != queue.channel && newState.member.id === client.user.id)
    return queue.channel = newState.channel;

  // if there are still members in the vc who are not bots return
  if (!(queue.channel.members.filter((member) => !member.user.bot).size === 0)) return;

  await queue.textChannel.send(`All members left ${queue.channel}, stopping the music...`);
  queue.connection.destroy();
  client.queue.delete(oldState.guild.id);
};
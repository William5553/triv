module.exports = (client, oldState, newState) => {
  const queue = client.queue.find((g) => g.guildID === oldState.guild.id);
  if (!queue) return;

  // if the bot has been kicked from the channel, destroy ytdl stream and remove the queue
  if (newState.member.id === client.user.id && !newState.channelID) {
    queue.stream.destroy();
    client.queue.delete(newState.guild.id);
  }

  // If the member leaves a voice channel
  if (!oldState.channelID || newState.channelID) return; 
        
  if (!(queue.connection.channel.members.filter((member) => !member.user.bot).size === 0)) return;
  // Disconnect from the voice channel
  queue.connection.channel.leave();
  // Delete the queue
  client.queue.delete(oldState.guild.id);          
};

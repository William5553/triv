module.exports = (client, oldState, newState) => {
  const queue = client.queue.get(oldState.guild.id);
  if (!queue) return;

  // when bot gets kicked
  if (newState.member.id === client.user.id && !newState.channelID) {
    queue.stream.destroy();
    client.queue.delete(oldState.guild.id);
  }
  
  // when member joins vc return
  if ((!oldState.channelID || newState.channelID) && newState.channelID === queue.channel) return; 
  // if there are still members in the vc who are not bots return
  if (!(queue.channel.members.filter((member) => !member.user.bot).size === 0)) return;
  queue.channel.leave();
  client.queue.delete(oldState.guild.id);          
};

module.exports = {
  canModifyQueue(member) {
    if (!member || !member.voice || !member.guild.voice) return member.client.logger.error('member.voice or member.guild.voice is not present');
    const client = member.client,
      memChan = member.voice.channelID,
      botChan = member.guild.voice.channelID;
    
    if (client.blacklist.user.includes(member.user.id)) {
      member.send('You are blacklisted').catch(client.logger.error);
      return false;
    }
    if (memChan === botChan || client.owners.includes(member.user.id))
      return true;
    member.send('You need to join the voice channel first!').catch(client.logger.error);
    return false;
  }
};

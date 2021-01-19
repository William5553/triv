module.exports = {
  canModifyQueue(member) {
    if (!member || !member.voice || !member.guild.voice) return member.client.logger.error('member.voice or member.guild.voice is not present');
    const memChan = member.voice.channelID;
    const botChan = member.guild.voice.channelID;
    
    if (member.client.blacklist.includes(member.user.id))
      return member.send('You are temporarily blacklisted').catch(member.client.logger.error);
    if (memChan === botChan || member.id === member.client.settings.owner_id)
      return true;
    return member.send('You need to join the voice channel first!').catch(member.client.logger.error);
  }
};

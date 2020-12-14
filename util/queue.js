const settings = require('../settings.json');

module.exports = {
  canModifyQueue(member) {
    if (!member || !member.voice || !member.guild.voice) return member.client.logger.error('member.voice or member.guild.voice is not present');
    const memChan = member.voice.channelID;
    const botChan = member.guild.voice.channelID;

    if (memChan === botChan || member.id === settings.ownerid)
      return true;
    return member.send('You need to join the voice channel first!').catch(member.client.logger.error);
  }
};

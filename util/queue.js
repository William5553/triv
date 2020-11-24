const settings = require("../settings.json");
module.exports = {
  canModifyQueue(member) {
    const { channelID } = member.voice;
    const botChannel = member.guild.voice.channelID;

    if (channelID == botChannel || member.id == settings.ownerid) {
      return true;
    }
    member
      .send("You need to join the voice channel first!")
      .catch(member.client.logger.error);
    return;
  }
};

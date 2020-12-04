const path = require('path');
const data = require('../assets/hearing-test');

const yes = ['true', 'yes', 'y', 'ye', 'yeah', 'yup', 'yea', 'ya', 'hai', 'si', 'sí', 'oui', 'はい', 'correct'];
const no = ['false', 'no', 'n', 'nah', 'nope', 'nop', 'iie', 'いいえ', 'non', 'fuck off'];

exports.run = async (client, msg) => {
  try {
    let age;
    let range;
    let previousAge = 'all';
    let previousRange = 8;
    for (const { age: dataAge, khz, file } of data) {
      if (!msg.guild.voice.channel)
        await client.commands.get('join').run(client, msg);
      else if (member.voice.channelID !== member.guild.voice.channelID)
        return msg.reply("I'm already in a voice channel");
      msg.guild.voice.connection.play(path.join(__dirname, '..', 'assets', file));
      await client.wait(3500);
      const heard = await client.awaitReply(msg, 'Did you hear that sound? Reply with **[y]es** or **[n]o**.');
      let hearddd;
      if (yes.includes(heard)) hearddd = true;
      if (no.includes(heard)) hearddd = false;
      if (hearddd === undefined) return msg.reply(`${heard} is not a valid response`);
      if (!heard || file === data[data.length - 1].file) {
        age = previousAge;
        range = previousRange;
        break;
      }
      previousAge = dataAge;
      previousRange = khz;
    }
    if (age === 'all')
      return msg.channel.send('Everyone should be able to hear that. You cannot hear.');
    if (age === 'max') 
      return msg.channel.send(`You can hear any frequency of which a human is capable. The maximum frequency you were able to hear was **${range}000hz**.`);
    return msg.channel.send(`You have the hearing of someone **${Number.parseInt(age, 10) + 1} or older**. The maximum frequency you were able to hear was **${range}000hz**.`);
  } catch (err) {
    return msg.reply(`oh no, an error occurred: \`${err.message}\`. Try again later!`);
  }
};

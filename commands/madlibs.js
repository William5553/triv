const libs = require('../assets/mad-libs.json');

exports.run = async (client, msg) => {
  const current = client.games.get(msg.channel.id);
  if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
  client.games.set(msg.channel.id, { name: 'madlibs' });
  try {
    const lib = libs.random();
    const choices = [];
    for (const word of lib.needed) {
      await msg.reply(`Give me a **${word}**.`);
      const filter = res => {
        if (res.author.id !== msg.author.id) return false;
        if (!res.content || res.content.length > 16) {
          msg.reply('only use a maximum of 16 characters per word.').catch(() => null);
          return false;
        }
        return true;
      };
      const choice = await msg.channel.awaitMessages(filter, {
        max: 1,
        time: 120000
      });
      if (!choice.size) break;
      choices.push(choice.first().content);
    }
    client.games.delete(msg.channel.id);
    let finished = lib.text;
    for (let i = 0; i < choices.length; i++) {
      finished = finished.replace(/{(\d+)}/g, (match, number) => { 
        return typeof choices[number] != 'undefined' ? `**${choices[number]}**` : match;
      });
    }
    return msg.channel.send(finished);
  } catch (err) {
    client.games.delete(msg.channel.id);
    throw err;
  }
};
  
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'madlibs',
  description: 'Choose words that fill in the blanks to create a crazy story',
  usage: 'madlibs'
};

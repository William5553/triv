const libs = require('../assets/mad-libs.json');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
  const current = client.games.get(message.channel.id);
  if (current) return message.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
  client.games.set(message.channel.id, { name: 'madlibs' });
  try {
    const lib = libs.random();
    const choices = [];
    const m = await message.channel.send('Please wait..');
    if (message.guild) m.delete();
    for (const word of lib.needed) {
      const msg = `Give me a${word.startsWith('A') ? 'n' : ''} **${word}**.`;
      if (message.guild)
        await m.edit(m.content == msg ? `Give me another **${word}**` : msg);
      else
        await message.channel.send(m.content == msg ? `Give me another **${word}**` : msg);
      const filter = res => {
        if (res.author.id !== message.author.id) return false;
        if (!res.content || res.content.length > 16) {
          message.reply('Only use a maximum of 16 characters per word.');
          return false;
        }
        return true;
      };
      const choice = await message.channel.awaitMessages({ filter, max: 1, time: 120000 });
      if (!choice.size) break;
      choices.push(choice.first().content);
      if (message.guild) choice.first().delete();
    }
    await m.delete();
    client.games.delete(message.channel.id);
    let finished = lib.text;
    for (let i = 0; i < choices.length; i++) {
      finished = finished.replace(/{(\d+)}/g, (match, number) => { 
        return typeof choices[number] != 'undefined' ? `**${choices[number]}**` : match;
      });
    }
    return message.channel.send(finished);
  } catch (err) {
    client.games.delete(message.channel.id);
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor('#FF0000')
        .setTimestamp()
        .setTitle('Please report this on GitHub')
        .setURL('https://github.com/william5553/triv/issues')
        .setDescription(`Stack Trace:\n\`\`\`${err.stack || err}\`\`\``)
        .addField('**Command:**', message.content)
    ]});
  }
};
  
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['ml', 'madlib'],
  permLevel: 0,
  cooldown: 5000
};

exports.help = {
  name: 'madlibs',
  description: 'Choose words that fill in the blanks to create a crazy story',
  usage: 'madlibs',
  example: 'madlibs'
};

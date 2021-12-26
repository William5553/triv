const words = require('../assets/reaction.json');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
  const current = client.games.get(message.channel.id);
  if (current) return message.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
  client.games.set(message.channel.id, { name: 'reactiontime' });
  try {
    await message.channel.send('Get Ready...');
    await client.wait(Math.floor(Math.random() * (10_000 - 1500 + 1)) + 1500);
    const word = words.random();
    await message.reply(`TYPE \`${word.toUpperCase()}\` NOW!`);
    const filter = res => message.author.id === res.author.id && res.content.toLowerCase() === word;
    const now = Date.now();
    const messages = await message.channel.awaitMessages({ filter, max: 1, time: 20_000 });
    client.games.delete(message.channel.id);
    if (messages.size === 0) return message.channel.send('Failed to answer within 20 seconds.');
    return message.channel.send(`Nice one! (Took ${(Date.now() - now) / 1000} seconds)`);
  } catch (error) {
    client.games.delete(message.channel.id);
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor('#FF0000')
        .setTimestamp()
        .setTitle('Please report this on GitHub')
        .setURL('https://github.com/william5553/triv/issues')
        .setDescription(`Stack Trace:\n\`\`\`${error.stack ?? error}\`\`\``)
        .addField('**Command:**', message.content)
    ]});
  }
};
    
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['reaction', 'react'],
  permLevel: 0,
  cooldown: 2000
};

exports.help = {
  name: 'reactiontime',
  description: 'Test your reaction speed',
  usage: 'reactiontime',
  example: 'reactiontime'
};

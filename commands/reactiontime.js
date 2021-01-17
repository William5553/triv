const words = require('../assets/reaction.json'),
  { MessageEmbed } = require('discord.js');
exports.run = async (client, msg) => {
  const current = client.games.get(msg.channel.id);
  if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
  client.games.set(msg.channel.id, { name: 'reactiontime' });
  try {
    await msg.channel.send('Get Ready...');
    await client.wait(Math.floor(Math.random() * (10000 - 1500 + 1)) + 1500);
    const word = words.random();
    await msg.reply(`TYPE \`${word.toUpperCase()}\` NOW!`);
    const filter = res => msg.author.id === res.author.id && res.content.toLowerCase() === word;
    const now = Date.now();
    const msgs = await msg.channel.awaitMessages(filter, {
      max: 1,
      time: 20000
    });
    client.games.delete(msg.channel.id);
    if (!msgs.size) return msg.channel.send('Failed to answer within 20 seconds.');
    return msg.channel.send(`Nice one! (Took ${(Date.now() - now) / 1000} seconds)`);
  } catch (err) {
    client.games.delete(msg.channel.id);
    return msg.channel.send(new MessageEmbed()
      .setColor('RED')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`Stack Trace:\n\`\`\`${err.stack}\`\`\``)
      .addField('**Command:**', `${msg.content}`)
    );
  }
};
    
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['reaction', 'react'],
  permLevel: 0
};

exports.help = {
  name: 'reactiontime',
  description: 'Test your reaction speed',
  usage: 'reactiontime'
};

const words = ['fire', 'draw', 'shoot', 'bang', 'pull', 'boom'];
exports.run = async (client, msg) => {
  const current = client.games.get(msg.channel.id);
  if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
  this.client.games.set(msg.channel.id, { name: 'reactiontime' });
  try {
    await msg.channel.send('Get Ready...');
    await client.wait(Math.floor(Math.random() * (10000 - 1500 + 1)) + 1500);
    const word = words.random();
    await msg.say(`TYPE \`${word.toUpperCase()}\` NOW!`);
    const filter = res => msg.author.id === res.author.id && res.content.toLowerCase() === word;
    const now = Date.now();
    const msgs = await msg.channel.awaitMessages(filter, {
      max: 1,
      time: 30000
    });
    this.client.games.delete(msg.channel.id);
    if (!msgs.size) return msg.say('Failed to answer within 30 seconds.');
    return msg.say(`Nice one! (Took ${(Date.now() - now) / 1000} seconds)`);
  } catch (err) {
    client.games.delete(msg.channel.id);
    throw err;
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

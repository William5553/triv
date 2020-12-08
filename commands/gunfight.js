const words = ['fire', 'draw', 'shoot', 'bang', 'pull', 'boom'];
exports.run = async (client, msg) => {
  const opponent = msg.mentions.users.first();
  if (opponent.bot) return msg.reply('bots may not be fought.');
  if (opponent.id === msg.author.id) return msg.reply('you may not fight yourself.');
  const current = client.games.get(msg.channel.id);
  if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
  client.games.set(msg.channel.id, { name: 'gunfight' });
  try {
    await msg.channel.send(`${opponent}, do you accept this challenge?`);
    const verification = await client.verify(msg.channel, opponent);
    if (!verification) {
      client.games.delete(msg.channel.id);
      return msg.channel.send('Looks like they declined...');
    }
    await msg.channel.send('Get Ready...');
    await client.wait(Math.random(2700, 30000));
    const word = words.random();
    await msg.channel.send(`TYPE \`${word.toUpperCase()}\` NOW!`);
    const filter = res => [opponent.id, msg.author.id].includes(res.author.id) && res.content.toLowerCase() === word;
    const winner = await msg.channel.awaitMessages(filter, {
      max: 1,
      time: 30000
    });
    client.games.delete(msg.channel.id);
    if (!winner.size) return msg.say('Oh... No one won.');
    return msg.channel.send(`The winner is ${winner.first().author}!`);
  } catch (err) {
    client.games.delete(msg.channel.id);
    throw err;
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['western', 'wildwest'],
  permLevel: 0
};

exports.help = {
  name: 'gunfight',
  description: "Engage in a western gunfight against another user. It's high noon.",
  usage: 'gunfight [user]'
};
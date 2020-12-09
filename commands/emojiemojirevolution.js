const emojis = ['⬆', '↗', '➡', '↘', '⬇', '↙', '⬅', '↖'];
const emojisNew = ['⬆️', '↗️', '➡️', '↘️', '⬇️', '↙️', '⬅️', '↖️'];

exports.run = async (client, msg) => {
  const opponent = msg.mentions.users.first();
  if (opponent.bot) return msg.reply('bots may not be played against.');
  if (opponent.id === msg.author.id) return msg.reply('you may not play against yourself.');
  const current = client.games.get(msg.channel.id);
  if (current) return msg.reply(`please wait until the current game of \`${current.name}\` is finished.`);
  client.games.set(msg.channel.id, { name: 'emojiemojirevolution' });
  try {
    await msg.channel.send(`${opponent}, do you accept this challenge?`);
    const verification = await client.verify(msg.channel, opponent);
    if (!verification) {
      client.games.delete(msg.channel.id);
      return msg.channel.send('Looks like they declined...');
    }
    let turn = 0;
    let aPts = 0;
    let oPts = 0;
    let lastTurnTimeout = false;
    while (turn < 10) {
      ++turn;
      const num = Math.floor(Math.random() * emojis.length);
      const emoji = [emojis[num], emojisNew[num]];
      await msg.channel.send(`Repeat the emoji\n${emojisNew[num]}`);
      const filter = res => [msg.author.id, opponent.id].includes(res.author.id) && emoji.includes(res.content);
      const win = await msg.channel.awaitMessages(filter, {
        max: 1,
        time: 30000
      });
      if (!win.size) {
        await msg.channel.send('No one even tried that round.');
        if (lastTurnTimeout) {
          break;
        } else {
          lastTurnTimeout = true;
          continue;
        }
      }
      const winner = win.first().author;
      if (winner.id === msg.author.id) ++aPts;
      else ++oPts;
      await msg.channel.send(`${winner} won this round!\n**${msg.author.username}:** ${aPts}\n**${opponent.username}:** ${oPts}`);
      if (lastTurnTimeout) lastTurnTimeout = false;
    }
    client.games.delete(msg.channel.id);
    if (aPts === oPts) return msg.channel.send('It\'s a tie!');
    const userWin = aPts > oPts;
    return msg.channel.send(`You win ${userWin ? msg.author : opponent} with ${userWin ? aPts : oPts} points!`);
  } catch (err) {
    client.games.delete(msg.channel.id);
    throw err;
  }};
  
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['eer'],
  permLevel: 0
};

exports.help = {
  name: 'emojiemojirevolution',
  description: 'Can you type arrow emoji faster than anyone else has ever typed them before?',
  usage: 'eer [user]',
};

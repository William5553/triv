const blankEmoji = '⚪️';
const playerOneEmoji = '🔴';
const playerTwoEmoji = '🟡';
const nums = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣'];

exports.run = async (client, msg) => {
  const opponent = msg.mentions.users.first();
  if (opponent.bot) return msg.reply('bots may not be played against.');
  if (opponent.id === msg.author.id) return msg.reply('you may not play against yourself.');
  const current = client.games.get(msg.channel.id);
  if (current) return msg.reply(`wait until the current game of \`${current.name}\` is finished.`);
  client.games.set(msg.channel.id, { name: 'connectfour' });
  try {
    await msg.channel.send(`${opponent}, do you accept this challenge?`);
    const verification = await client.verify(msg.channel, opponent);
    if (!verification) {
      client.games.delete(msg.channel.id);
      return msg.channel.send('Looks like they declined...');
    }
    const board = generateBoard();
    let userTurn = true;
    let winner = null;
    const colLevels = [5, 5, 5, 5, 5, 5, 5];
    let lastTurnTimeout = false;
    while (!winner && board.some(row => row.includes(null))) {
      const user = userTurn ? msg.author : opponent;
      const sign = userTurn ? 'user' : 'oppo';
      await msg.channel.send(`
					${user}, which column do you pick? Type \`end\` to forefeit.
					${displayBoard(board)}
					${nums.join('')}
				`);
      const filter = res => {
        if (res.author.id !== user.id) return false;
        const choice = res.content;
        if (choice.toLowerCase() === 'end') return true;
        const i = Number.parseInt(choice, 10) - 1;
        return board[colLevels[i]] && board[colLevels[i]][i] !== undefined;
      };
      const turn = await msg.channel.awaitMessages(filter, {
        max: 1,
        time: 60000
      });
      if (!turn.size) {
        await msg.channel.send('Sorry, time is up!');
        if (lastTurnTimeout) {
          winner = 'time';
          break;
        } else {
          lastTurnTimeout = true;
          userTurn = !userTurn;
          continue;
        }
      }
      const choice = turn.first().content;
      if (choice.toLowerCase() === 'end') {
        winner = userTurn ? opponent : msg.author;
        break;
      }
      const i = Number.parseInt(choice, 10) - 1;
      board[colLevels[i]][i] = sign;
      colLevels[i]--;
      if (verifyWin(board)) winner = userTurn ? msg.author : opponent;
      if (lastTurnTimeout) lastTurnTimeout = false;
      userTurn = !userTurn;
    }
    client.games.delete(msg.channel.id);
    if (winner === 'time') return msg.channel.send('Game ended due to inactivity.');
    return msg.channel.send(winner ? `Congrats, ${winner}!` : 'Looks like it\'s a draw...');
  } catch (err) {
    client.games.delete(msg.channel.id);
    throw err;
  }
};

function checkLine(a, b, c, d) {
  return a !== null && a === b && a === c && a === d;
}

function verifyWin(bd) {
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 7; c++) {
      if (checkLine(bd[r][c], bd[r + 1][c], bd[r + 2][c], bd[r + 3][c])) return bd[r][c];
    }
  }
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 4; c++) {
      if (checkLine(bd[r][c], bd[r][c + 1], bd[r][c + 2], bd[r][c + 3])) return bd[r][c];
    }
  }
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      if (checkLine(bd[r][c], bd[r + 1][c + 1], bd[r + 2][c + 2], bd[r + 3][c + 3])) return bd[r][c];
    }
  }
  for (let r = 3; r < 6; r++) {
    for (let c = 0; c < 4; c++) {
      if (checkLine(bd[r][c], bd[r - 1][c + 1], bd[r - 2][c + 2], bd[r - 3][c + 3])) return bd[r][c];
    }
  }
  return null;
}

function generateBoard() {
  const arr = [];
  for (let i = 0; i < 6; i++) {
    arr.push([null, null, null, null, null, null, null]);
  }
  return arr;
}

function displayBoard(board) {
  return board.map(row => row.map(piece => {
    if (piece === 'user') return playerOneEmoji;
    if (piece === 'oppo') return playerTwoEmoji;
    return blankEmoji;
  }).join('')).join('\n');
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['connect4'],
  permLevel: 0
};

exports.help = {
  name: 'connectfour',
  description: 'Play a game of Connect Four with friends',
  usage: 'connectfour [opponent]'
};

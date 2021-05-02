const { MessageEmbed } = require('discord.js');
const { verify } = require('../util/Util');
const blankEmoji = '⚪️';
const playerOneEmoji = '🔴';
const playerTwoEmoji = '🟡';
const nums = [':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:'];

exports.run = async (client, message, args) => {
  const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLowerCase());
  const opponent = member.user;
  if (!opponent) return message.reply('tag someone, moron');
  if (opponent.bot) return message.reply('make some friends, you loser.');
  if (opponent.id === message.author.id) return message.reply('you may not play against yourself.');
  const current = client.games.get(message.channel.id);
  if (current) return message.reply(`wait until the current game of \`${current.name}\` is finished.`);
  client.games.set(message.channel.id, { name: 'connectfour' });
  try {
    await message.channel.send(`${opponent}, do you accept this challenge?`);
    const verification = await verify(message.channel, opponent);
    if (verification != true) {
      client.games.delete(message.channel.id);
      return message.channel.send('Looks like they declined...');
    }
    const board = generateBoard();
    let userTurn = true,
      winner = null;
    const colLevels = [5, 5, 5, 5, 5, 5, 5];
    let lastTurnTimeout = false;
    while (!winner && board.some(row => row.includes(null))) {
      const user = userTurn ? message.author : opponent,
        sign = userTurn ? 'user' : 'oppo';
      await message.channel.send(`${user}, which column do you pick? Type \`end\` to forefeit.\n${displayBoard(board)}\n${nums.join('')}`);
      const filter = res => {
        if (res.author.id !== user.id) return false;
        const choice = res.content;
        if (choice.toLowerCase() === 'end') return true;
        const i = Number.parseInt(choice, 10) - 1;
        return board[colLevels[i]] && board[colLevels[i]][i] !== undefined;
      };
      const turn = await message.channel.awaitMessages(filter, {
        max: 1,
        time: 60000
      });
      if (!turn.size) {
        await message.channel.send('Sorry, time is up!');
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
        winner = userTurn ? opponent : message.author;
        break;
      }
      const i = Number.parseInt(choice, 10) - 1;
      board[colLevels[i]][i] = sign;
      colLevels[i]--;
      if (verifyWin(board)) winner = userTurn ? message.author : opponent;
      if (lastTurnTimeout) lastTurnTimeout = false;
      userTurn = !userTurn;
    }
    client.games.delete(message.channel.id);
    if (winner === 'time') return message.channel.send('Game ended due to inactivity.');
    return message.channel.send(winner ? `Congrats, ${winner}!` : "Looks like it's a draw...");
  } catch (err) {
    client.games.delete(message.channel.id);
    return message.channel.send(new MessageEmbed()
      .setColor('#FF0000')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`Stack Trace:\n\`\`\`${err.stack || err}\`\`\``)
      .addField('**Command:**', `${message.content}`)
    );
  }
};

function checkLine(a, b, c, d) {
  return a !== null && a === b && a === c && a === d;
}

function verifyWin(bd) {
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 7; c++)
      if (checkLine(bd[r][c], bd[r + 1][c], bd[r + 2][c], bd[r + 3][c])) return bd[r][c];
  }
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 4; c++)
      if (checkLine(bd[r][c], bd[r][c + 1], bd[r][c + 2], bd[r][c + 3])) return bd[r][c];
  }
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++)
      if (checkLine(bd[r][c], bd[r + 1][c + 1], bd[r + 2][c + 2], bd[r + 3][c + 3])) return bd[r][c];
  }
  for (let r = 3; r < 6; r++) {
    for (let c = 0; c < 4; c++)
      if (checkLine(bd[r][c], bd[r - 1][c + 1], bd[r - 2][c + 2], bd[r - 3][c + 3])) return bd[r][c];
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
  aliases: ['connect4', 'conn4'],
  permLevel: 0
};

exports.help = {
  name: 'connectfour',
  description: 'Play a game of Connect Four with friends',
  usage: 'connectfour [opponent]',
  example: 'connectfour @Joe'
};

const request = require('node-superfetch'),
  { Collection } = require('discord.js'),
  choices = ['A', 'B', 'C', 'D'];

exports.run = async (client, msg, args) => {
  const current = client.games.get(msg.channel.id);
  if (current)
    return msg.reply(
      `Please wait until the current game of \`${current.name}\` is finished.`
    );
  client.games.set(msg.channel.id, { name: 'quizduel' });
  try {
    const players = Number(args[0]);
    if (!players || isNaN(players) || players > 100 || players < 1)
      return msg.channel.send(
        `Usage: ${client.settings.prefix}${exports.help.usage}`
      );
    const awaitedPlayers = await awaitPlayers(msg, players);
    let turn = 0;
    const pts = new Collection();
    for (const player of awaitedPlayers) {
      pts.set(player, {
        points: 0,
        id: player,
        user: await client.users.fetch(player)
      });
    }
    const questions = await fetchQuestions();
    let lastTurnTimeout = false;
    while (questions.length) {
      ++turn;
      const question = questions[0];
      questions.shift();
      await msg.channel.send(`
					**${turn}. ${question.category}**
					${question.question}
					${question.answers
    .map((answer, i) => `**${choices[i]}.** ${answer}`)
    .join('\n')}
				`);
      const filter = res => {
        if (!awaitedPlayers.includes(res.author.id)) return false;
        const answer = res.content.toUpperCase();
        if (choices.includes(answer)) {
          if (
            msg.channel
              .permissionsFor(res.author)
              .has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'])
          )
            msg.react('✅');
          return true;
        }
        return false;
      };
      const msgs = await msg.channel.awaitMessages(filter, {
        max: pts.size,
        time: 30000
      });
      if (!msgs.size) {
        await msg.channel.send(
          `No answers? Well, it was **${question.correct}**.`
        );
        if (lastTurnTimeout) {
          break;
        } else {
          lastTurnTimeout = true;
          continue;
        }
      }
      const answers = msgs.map(res => {
        const choice = choices.indexOf(res.content.toUpperCase());
        return {
          answer: question.answers[choice],
          id: res.author.id
        };
      });
      const correct = answers.filter(
        answer => answer.answer === question.correct
      );
      for (const answer of correct) {
        const player = pts.get(answer.id);
        if (correct[0].id === answer.id) player.points += 75;
        else player.points += 50;
      }
      await msg.channel.send(`
      It was... **${question.correct}**!
      _Fastest Guess: ${
  correct.length
    ? `${pts.get(correct[0].id).user.tag} (+75 pts)`
    : 'No One...'
}_
					${questions.length ? '_Next round starting in 5 seconds..._' : ''}
				`);
      if (lastTurnTimeout) lastTurnTimeout = false;
      if (questions.length) await client.wait(5000);
    }
    client.games.delete(msg.channel.id);
    const winner = pts.sort((a, b) => b.points - a.points).first().user;
    return msg.channel.send(`
				Congrats, ${winner}!
				__**Top 10:**__
				${makeLeaderboard(pts)
    .slice(0, 10)
    .join('\n')}
			`);
  } catch (err) {
    client.games.delete(msg.channel.id);
    throw err;
  }
};

async function fetchQuestions() {
  const { body } = await request.get('https://opentdb.com/api.php').query({
    amount: 7,
    type: 'multiple',
    encode: 'url3986'
  });
  if (!body.results) return this.fetchQuestions();
  const questions = body.results;
  return questions.map(question => {
    const answers = question.incorrect_answers.map(answer =>
      decodeURIComponent(answer.toLowerCase())
    );
    const correct = decodeURIComponent(question.correct_answer.toLowerCase());
    answers.push(correct);
    return {
      question: decodeURIComponent(question.question),
      category: decodeURIComponent(question.category),
      answers: answers.shuffle(),
      correct
    };
  });
}

function makeLeaderboard(pts) {
  let i = 0;
  let previousPts = null;
  let positionsMoved = 1;
  return pts
    .sort((a, b) => b.points - a.points)
    .map(player => {
      if (previousPts === player.points) {
        positionsMoved++;
      } else {
        i += positionsMoved;
        positionsMoved = 1;
      }
      previousPts = player.points;
      return `**${i}.** ${player.user.tag} (${player.points} Point${
        player.points === 1 ? '' : 's'
      })`;
    });
}

async function awaitPlayers(msg, max, min = 1) {
  if (max === 1) return [msg.author.id];
  const addS = min - 1 === 1 ? '' : 's';
  await msg.channel.send(
    `You will need at least ${min - 1} more player${addS} (at max ${max -
      1}). To join, type \`join game\`.`
  );
  const joined = [];
  joined.push(msg.author.id);
  const filter = res => {
    if (res.author.bot) return false;
    if (joined.includes(res.author.id)) return false;
    if (res.content.toLowerCase() !== 'join game') return false;
    joined.push(res.author.id);
    if (
      msg.channel
        .permissionsFor(res.author)
        .has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'])
    )
      msg.react('✅');
  };

  const verify = await msg.channel.awaitMessages(filter, {
    max: max - 1,
    time: 60000
  });
  verify.set(msg.id, msg);
  if (verify.size < min) return false;
  return verify.map(player => player.author.id);
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'quizduel',
  description: 'Answer a series of quiz questions against other opponents',
  usage: 'quizduel [player count]'
};

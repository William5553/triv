const request = require('node-superfetch');
const { Collection, MessageEmbed } = require('discord.js');
const choices = ['A', 'B', 'C', 'D'];

exports.run = async (client, message, args) => {
  const current = client.games.get(message.channel.id);
  if (current)
    return message.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
  client.games.set(message.channel.id, { name: 'quizduel' });
  try {
    const players = Number(args[0]);
    if (!players || isNaN(players) || players > 100 || players < 1) {
      client.games.delete(message.channel.id);
      return message.channel.send(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
    }
    const awaitedPlayers = await awaitPlayers(message, players);
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
      await message.channel.send(`**${turn}. ${question.category}**\n${question.question}\n${question.answers.map((answer, i) => `**${choices[i]}.** ${answer}`).join('\n')}`);
      const filter = res => {
        if (!awaitedPlayers.includes(res.author.id)) return false;
        const answer = res.content.toUpperCase();
        if (choices.includes(answer)) {
          if (message.channel.permissionsFor(client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY']))
            message.react('✅');
          return true;
        }
        return false;
      };
      const messages = await message.channel.awaitMessages({ filter, max: pts.size, time: 30000 });
      if (!messages.size) {
        await message.channel.send(`No answers? Well, it was **${question.correct}**.`);
        if (lastTurnTimeout) {
          break;
        } else {
          lastTurnTimeout = true;
          continue;
        }
      }
      const answers = messages.map(res => {
        const choice = choices.indexOf(res.content.toUpperCase());
        return {
          answer: question.answers[choice],
          id: res.author.id
        };
      });
      const correct = answers.filter(answer => answer.answer === question.correct);
      for (const answer of correct) {
        const player = pts.get(answer.id);
        if (correct[0].id === answer.id)
          player.points += 75;
        else
          player.points += 50;
      }
      await message.channel.send(`It was... **${question.correct}**!\n_Fastest Guess: ${correct.length ? `${pts.get(correct[0].id).user.tag} (+75 pts)` : 'no one'}_\n${questions.length ? '_Next round starting in 5 seconds..._' : ''}`);
      if (lastTurnTimeout) lastTurnTimeout = false;
      if (questions.length) await client.wait(5000);
    }
    client.games.delete(message.channel.id);
    const winner = pts.sort((a, b) => b.points - a.points).first().user;
    return message.channel.send(`Congrats, ${winner}!\n__**Top 10:**__\n${makeLeaderboard(pts).slice(0, 10).join('\n')}`);
  } catch (err) {
    client.games.delete(message.channel.id);
    return message.channel.send({embeds: [new MessageEmbed()
      .setColor('#FF0000')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`**Stack Trace:**\n\`\`\`${err.stack || err}\`\`\``)
      .addField('**Command:**', message.content)
    ]});
  }
};

async function fetchQuestions() {
  const { body } = await request.get('https://opentdb.com/api.php').query({
    amount: 7,
    type: 'multiple',
    encode: 'url3986'
  });
  if (!body.results) return fetchQuestions();
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

async function awaitPlayers(message, max) {
  if (max === 0) return [message.author.id];
  await message.channel.send(`To join, type \`join game\`. Max players: ${max}`);
  const joined = [message.author.id];
  const filter = res => {
    if (res.author.bot) return;
    if (joined.includes(res.author.id)) return;
    if (res.content.toLowerCase() !== 'join game') return;
  };
  
  const p = await message.channel.awaitMessages({ filter, max, time: 60000 });
  
  p.map(msg => {
    joined.push(msg.author.id);
    if (msg.channel.permissionsFor(message.client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY']))
      msg.react('✅');
  });
  
  return joined;
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0,
  cooldown: 5000
};

exports.help = {
  name: 'quizduel',
  description: 'Answer a series of quiz questions against other opponents',
  usage: 'quizduel [max player count]',
  example: 'quizduel 3'
};

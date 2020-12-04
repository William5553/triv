const Deck = require('../util/Deck');
const hitWords = ['hit', 'hit me', 'h'];
const standWords = ['stand', 's'];

exports.run = (client, msg, args) => {
const current = client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		try { 
    const deckCount = args[0];
    if (!deckCount || deckCount > 8 || deckCount < 1) return msg.reply('deck count must be between 1 and 8');
			client.games.set(msg.channel.id, { name: 'blackjack', data: new Deck({ deckCount }) });
			const dealerHand = [];
			draw(msg.channel, dealerHand);
			draw(msg.channel, dealerHand);
			const playerHand = [];
			draw(msg.channel, playerHand);
			draw(msg.channel, playerHand);
			const dealerInitialTotal = calculate(dealerHand);
			const playerInitialTotal = calculate(playerHand);
			if (dealerInitialTotal === 21 && playerInitialTotal === 21) {
				client.games.delete(msg.channel.id);
				return msg.channel.send('Well, both of you just hit blackjack. Right away. Rigged.');
			} else if (dealerInitialTotal === 21) {
				client.games.delete(msg.channel.id);
				return msg.channel.send('Ouch, the dealer hit blackjack right away! Try again!');
			} else if (playerInitialTotal === 21) {
				client.games.delete(msg.channel.id);
				return msg.channel.send('Wow, you hit blackjack right away! Lucky you!');
			}
			let playerTurn = true;
			let win = false;
			let reason;
			while (!win) {
				if (playerTurn) {
					await msg.channel.send(`**First Dealer Card:** ${dealerHand[0].display}\n**You (${calculate(playerHand)}):**\n${playerHand.map(card => card.display).join('\n')}\n_Hit?_`);
					const hit = await client.verify(msg.channel, msg.author, { extraYes: hitWords, extraNo: standWords });
					if (hit) {
						const card = draw(msg.channel, playerHand);
						const total = calculate(playerHand);
						if (total > 21) {
							reason = `You drew ${card.display}, total of ${total}! Bust`;
							break;
						} else if (total === 21) {
							reason = `You drew ${card.display} and hit 21`;
							win = true;
						}
					} else {
						const dealerTotal = calculate(dealerHand);
						await msg.say(`Second dealer card is ${dealerHand[1].display}, total of ${dealerTotal}.`);
						playerTurn = false;
					}
				} else {
					const inital = calculate(dealerHand);
					let card;
					if (inital < 17) card = draw(msg.channel, dealerHand);
					const total = calculate(dealerHand);
					if (total > 21) {
						reason = `Dealer drew ${card.display}, total of ${total}! Dealer bust`;
						win = true;
					} else if (total >= 17) {
						const playerTotal = calculate(playerHand);
						if (total === playerTotal) {
							reason = `${card ? `Dealer drew ${card.display}, making it ` : ''}${playerTotal}-${total}`;
							break;
						} else if (total > playerTotal) {
							reason = `${card ? `Dealer drew ${card.display}, making it ` : ''}${playerTotal}-**${total}**`;
							break;
						} else {
							reason = `${card ? `Dealer drew ${card.display}, making it ` : ''}**${playerTotal}**-${total}`;
							win = true;
						}
					} else {
						await msg.channel.send(`Dealer drew ${card.display}, total of ${total}.`);
					}
				}
			}
			client.games.delete(msg.channel.id);
			if (win) return msg.channel.send(`${reason}! You won!`);
			return msg.channel.send(`${reason}! Too bad.`);
		} catch (err) {
			client.games.delete(msg.channel.id);
			throw err;
		}
	};

	draw(channel, hand) {
		const deck = this.client.games.get(channel.id).data;
		const card = deck.draw();
		hand.push(card);
		return card;
	}

	calculate(hand) {
		return hand.sort((a, b) => a.blackjackValue - b.blackjackValue).reduce((a, b) => {
			let { blackjackValue } = b;
			if (blackjackValue === 11 && a + blackjackValue > 21) blackjackValue = 1;
			return a + blackjackValue;
		}, 0);
	}
  exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['bj'],
  permLevel: 0
};

exports.help = {
  name: 'blackjack',
  description: 'Play a game of blackjack',
  usage: 'blackjack [deck count]'
};

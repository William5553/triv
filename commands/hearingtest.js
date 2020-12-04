const data = require('../assets/hearing-test');

exports.run = async (client, msg) => {
		try {
			let age;
			let range;
			let previousAge = 'all';
			let previousRange = 8;
			for (const { age: dataAge, khz, file } of data) {
				connection.play(path.join(__dirname, '..', 'assets', file));
				await client.wait(3500);
				const heard = await client.awaitReply(msg, 'Did you hear that sound? Reply with **[y]es** or **[n]o**.');
				if (!heard || file === data[data.length - 1].file) {
					age = previousAge;
					range = previousRange;
					break;
				}
				previousAge = dataAge;
				previousRange = khz;
			}
			if (age === 'all') return msg.reply('Everyone should be able to hear that. You cannot hear.');
			if (age === 'max') {
				return msg.reply(`
					You can hear any frequency of which a human is capable.
					The maximum frequency you were able to hear was **${range}000hz**.
			`);
			}
			return msg.reply(`
				You have the hearing of someone **${Number.parseInt(age, 10) + 1} or older**.
				The maximum frequency you were able to hear was **${range}000hz**.
			`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
  };

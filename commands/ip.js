const request = require('node-fetch');
exports.run = (client, message) => {
  const { body } = await request
			.get('https://api.ipify.org/')
			.query({ format: 'json' });
		await msg.direct(body.ip);
		return msg.say('📬 Sent the IP to your DMs!');
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 4
};

exports.help = {
  name: 'ip',
  description: "Responds with the IP address the bot's server is running on.",
  usage: 'ip',
};

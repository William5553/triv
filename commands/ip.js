const request = require('node-superfetch');
exports.run = async (client, message) => {
  const { body } = await request
    .get('https://api.ipify.org/')
    .query({ format: 'json' });
  await message.author.send(body.ip);
  if (message.guild) message.channel.send('📬 Sent the IP to your DMs!');
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 4
};

exports.help = {
  name: 'ip',
  description: "Responds with the IP address the bot's server is running on",
  usage: 'ip'
};

const joke = require('../assets/yomama.json');

exports.run = async (client, message) => message.channel.send(joke.random());

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  cooldown: 1000
};

exports.help = {
  name: 'yomama',
  description: 'Responds with a random "Yo Mama" joke',
  usage: 'yomama',
  example: 'yomama'
};

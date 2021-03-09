const options = require('../assets/ping.json');

exports.run = (client, message) => {
  message.channel.send('Ping?').then(msg => {
    msg.edit(`${options.random()} (${Date.now() - message.createdTimestamp}ms)`);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['pong'],
  permLevel: 0,
  cooldown: 500
};

exports.help = {
  name: 'ping',
  description: 'Ping command. I wonder what this does?',
  usage: 'ping'
};

exports.run = (client, message) => {
  const options = require('../assets/ping.json');
  
  message.channel.send('Ping?').then(msg => {
    msg.edit(`${options.random()} (${Date.now() - message.createdTimestamp}ms)`);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['pong'],
  permLevel: 0
};

exports.help = {
  name: 'ping',
  description: 'Ping command. I wonder what this does?',
  usage: 'ping'
};

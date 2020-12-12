exports.run = (client, message) => {
  const options = [
    'pong',
    'No! I say ping!',
    'Can you say pong?',
    'do I have to say pong?',
    'can I say nothing?',
    'Pongity Pow!',
    'no!',
    'erggggghhhh',
    `banned ${message.author}`,
  ];
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

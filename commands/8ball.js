exports.run = (client, message, args) => {
  const question = args.slice(0).join(' ');

  const responses = [
    'Explode', 'It is certain', 'It is decidedly so', 'Without a doubt', 'Yes definitely', 'You may rely on it', ' As I see it, yes', 'Most likely', 'Outlook good', 'Yes', 'Signs point to yes', 'Reply hazy try again', 'Ask again later', 'Better not tell you now', 'Cannot predict now', 'Concentrate and ask again', 'Don\'t count on it', 'My reply is no', 'My sources say no', 'Outlook not so good', 'Very doubtful'
  ];



  if (question.length < 1) return message.reply('How am I going to answer nothing?!');
  const response = `${responses[Math.floor(Math.random() * responses.length)]}`;
  if (response === 'Explode') return client.channel.sendFile('image', '../assets/explode8ball.png'); // try changing image to message
  message.channel.send(`${responses[Math.floor(Math.random() * responses.length)]}`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: '8ball',
  description: 'Shakey shakey.',
  usage: '8ball [question]'
};

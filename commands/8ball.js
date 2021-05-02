const path = require('path');

exports.run = (client, message, args) => {
  const question = args.join(' '),
    response = require('../assets/8ball.json').random();

  if (question.length < 1) return message.reply('ask me a question moron');
  if (response === 'Explode')
    message.channel.send({ files: [path.join(process.cwd(), 'assets', 'explode8ball.png')] }).catch(client.logger.error);
  else
    message.channel.send(`🎱 ${response}`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  cooldown: 500
};

exports.help = {
  name: '8ball',
  description: 'Asks the magic 8 ball a question',
  usage: '8ball [question]',
  example: '8ball will I be a billionaire?'
};

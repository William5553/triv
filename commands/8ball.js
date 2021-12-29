const path = require('node:path');
const process = require('node:process');

exports.run = (client, message, args) => {
  if (args.length === 0) return message.reply('Ask me a question, moron');
  const response = require('../assets/8ball.json').random();

  if (response === 'Explode')
    message.reply({ files: [path.join(process.cwd(), 'assets', 'explode8ball.png')] });
  else
    message.reply(`🎱 ${response}`);
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

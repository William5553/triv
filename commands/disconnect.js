const texts = require('../assets/shutdown.json');
const { verify } = require('../util/Util');

exports.run = async (client, message) => {
  const games = client.games.size;
  let areIs = 'are';
  if (games > 0) {
    const currentString = `${games} game${games > 1 ? 's' : ''}`;
    if (games === 1) areIs = 'is';
			
    await message.reply(`there ${areIs} currently **${currentString}**. Are you sure?`);
    const verification = await verify(message.channel, message.author);
    if (verification != true) return message.channel.send('Aborted restart.');
  }
  await message.channel.send(texts.random());
  await client.logger.warn(`${message.author.tag} is restarting the bot`);
  client.destroy();
  process.exit(0);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['die', 'kys', 'shutdown', 'restart', 'reboot', 'stfu'],
  permLevel: 10
};

exports.help = {
  name: 'disconnect',
  description: 'Kills the bot',
  usage: 'disconnect'
};

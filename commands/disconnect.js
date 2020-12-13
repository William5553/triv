const texts = require('../assets/shutdown.json');

exports.run = async (client, msg) => {
  const games = client.games.size;
  let areIs = 'are';
  if (games > 0) {
    const currentString = `${games} game${games > 1 ? 's' : ''}`;
    if (games === 1) areIs = 'is';
			
    await msg.reply(`there ${areIs} currently **${currentString}**. Are you sure?`);
    const verification = await client.verify(msg.channel, msg.author);
    if (!verification) return msg.channel.send('Aborted restart.');
  }
  await msg.channel.send(texts.random());
  client.destroy();
  process.exit(0);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['die', 'kys', 'shutdown', 'restart', 'reboot'],
  permLevel: 10
};

exports.help = {
  name: 'disconnect',
  description: 'Kills the bot',
  usage: 'disconnect'
};

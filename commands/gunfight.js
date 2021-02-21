const words = require('../assets/reaction.json'),
  { MessageEmbed } = require('discord.js');
exports.run = async (client, message) => {
  const opponent = message.mentions.users.first();
  if (opponent.bot) return message.reply('bots may not be fought.');
  if (opponent.id === message.author.id) return message.reply('you may not fight yourself.');
  const current = client.games.get(message.channel.id);
  if (current) return message.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
  client.games.set(message.channel.id, { name: 'gunfight' });
  try {
    await message.channel.send(`${opponent}, do you accept this challenge?`);
    const verification = await client.verify(message.channel, opponent);
    if (verification != true) {
      client.games.delete(message.channel.id);
      return message.channel.send('Looks like they declined...');
    }
    await message.channel.send('Get Ready...');
    await client.wait(Math.random(2700, 30000));
    const word = words.random();
    await message.channel.send(`TYPE \`${word.toUpperCase()}\` NOW!`);
    const filter = res => [opponent.id, message.author.id].includes(res.author.id) && res.content.toLowerCase() === word;
    const winner = await message.channel.awaitMessages(filter, {
      max: 1,
      time: 30000
    });
    client.games.delete(message.channel.id);
    if (!winner.size) return message.say('Oh... No one won.');
    return message.channel.send(`The winner is ${winner.first().author}!`);
  } catch (err) {
    client.games.delete(message.channel.id);
    return message.channel.send(new MessageEmbed()
      .setColor('RED')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`Stack Trace:\n\`\`\`${err.stack}\`\`\``)
      .addField('**Command:**', `${message.content}`)
    );
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['western', 'wildwest', 'gunduel'],
  permLevel: 0
};

exports.help = {
  name: 'gunfight',
  description: "Engage in a western gunfight against another user. It's high noon.",
  usage: 'gunfight [user]'
};

const { play } = require('../util/play');
const { canModifyQueue } = require('../util/Util');
const filters = [
  'bassboost', '8d', 'vaporwave', 'nightcore', 'phaser', 'tremolo', 'vibrato', 'reverse',
  'treble', 'normalizer', 'surround', 'pulsator', 'subboost', 'karaoke', 'flanger', 'gate',
  'haas', 'mcompand', 'earwax'
];

exports.run = (client, message, args) => {
  const queue = client.queue.get(message.guild.id);
  if (!queue) return message.reply('Nothing is playing');
  if (args.length < 1) return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
  const modifiable = canModifyQueue(message.member);
  if (modifiable != true) return message.reply(modifiable);
  if (args[0] !== 'list' && !filters.includes(args[1].toLowerCase())) return message.reply(`${args[1]} is not a valid filter. Valid filters are: ${filters.join(', ')}.`);
  if (args[0] === 'add')
    queue.filters[args[1].toLowerCase()] = true;
  else if (args[0] === 'remove')
    queue.filters[args[1].toLowerCase()] = false;
  else if (args[0] === 'list')
    message.channel.send(JSON.stringify(queue.filters).replace(/[{}"]/g, '').replace(/false/gi, ' ' + String.fromCharCode(10060)).replace(/true/gi, ' ' + String.fromCharCode(10003)).replace(/,/gi, '\n'));
  else return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
  if (args[0] === 'add' || args[0] === 'remove') play(queue.songs[0], message, true); 
};

exports.conf = {
  enabled: false,
  guildOnly: true,
  aliases: [],
  permLevel: 0,
  cooldown: 2500
};

exports.help = {
  name: 'filter',
  description: `Adds a filter to the music. Valid filters are: ${filters.join(', ')}`,
  usage: 'filter [list|add|remove] [filter]',
  example: 'filter add nightcore'
};

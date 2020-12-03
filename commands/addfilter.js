const { play } = require('../util/play');
const {canModifyQueue} = require('../util/queue');
const filters = {
    bassboost: 'bass=g=20,dynaudnorm=f=200',
    '8D': 'apulsator=hz=0.08',
    vaporwave: 'aresample=48000,asetrate=48000*0.8',
    nightcore: 'aresample=48000,asetrate=48000*1.25',
    phaser: 'aphaser=in_gain=0.4',
    tremolo: 'tremolo',
    vibrato: 'vibrato=f=6.5',
    reverse: 'areverse',
    treble: 'treble=g=5',
    normalizer: 'dynaudnorm=f=200',
    surrounding: 'surround',
    pulsator: 'apulsator=hz=1',
    subboost: 'asubboost',
    karaoke: 'stereotools=mlev=0.03',
    flanger: 'flanger',
    gate: 'agate',
    haas: 'haas',
    mcompand: 'mcompand'
};

exports.run = (client, message, args) => {
const queue = client.queue.get(message.guild.id);
  if (!queue) return message.reply('nothing is playing');
    if (!canModifyQueue(message.member)) return;
            Object.keys(newFilters).forEach((filterName) => {
                queue.filters[filterName] = newFilters[filterName]
            });
           play(queue.songs[0], message, true); 
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['filter'],
  permLevel: 0
};

exports.help = {
  name: 'addfilter',
  description: 'Adds a filter to the music. Valid filters are: bassboost, 8d, vaporwave, nightcore, phaser, tremolo, vibrato, reverse, treble, normalizer, surrounding, pulsator, subboost, karaoke, flanger, gate, haas, and mcompand.',
  usage: 'addfilter [filter]'
};

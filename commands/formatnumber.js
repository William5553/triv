exports.run = (client, message, args) => client.formatNumber(args.join(' '));

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['fnum'],
  permLevel: 0
};

exports.help = {
  name: 'formatnumber',
  description: 'Adds commas to a number',
  usage: 'formatnumber [number]'
};

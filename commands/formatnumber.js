exports.run = (client, message, args) => {
const number = args.join(' ');
message.channel.send(Number.parseFloat(number).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }));
};

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

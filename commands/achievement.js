const request = require('node-superfetch');

exports.run = (client, msg, args) => {
  let [title, contents] = args.join(' ').split('|');
  if (!contents) {
    [title, contents] = ['Achievement Get!', title];
  }
  let rnd = Math.floor(Math.random() * 39 + 1);
  if (args.join(' ').toLowerCase().includes('burn')) rnd = 38;
  if (args.join(' ').toLowerCase().includes('cake')) rnd = 10;

  if (title.length > 22 || contents.length > 22) return msg.reply('max length: 22 characters');
  request
    .get(`https://www.minecraftskinstealer.com/achievement/${rnd}/${encodeURIComponent(title)}/${encodeURIComponent(contents)}`)
    .then(ach => msg.channel.send({files:[{attachment: ach.body}]}));
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'achievement',
  description: 'Send a Minecraft achievement image to the channel',
  usage: 'achievement [Title|Text]',
  example: 'achievement Achievement Get|Used a Command!'
};

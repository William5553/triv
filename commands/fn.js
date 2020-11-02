const settings = require('../settings.json');
exports.run = (client, message, args) => {
if (args.length < 3) return message.channel.send(`Usage: ${settings.prefix}fn <pc|xbl|psn> <nickname>`);

let platform = args[0].lower();

if (platform === 'xbox') platform = 'xbl';
if (platform === 'ps4') platform = 'psn';
if (platform === 'pc' || platform === 'xbl' || platform === 'psn' {

} else return message.channel.send(`Usage: ${settings.prefix}fn <pc|xbl|psn> <nickname>`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'fn',
  description: 'Gets a players fortnite stats',
  usage: 'fn [platform] [username]'
};

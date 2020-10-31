exports.run = (client, message) => {
  const user = message.mentions.users.first();
  if (message.mentions.users.size < 1) return message.reply('try again but mention a user next time');
  message.channel.send(user.username + `\'s ID is ${user.id}`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'id',
  description: 'Gets a user\'s ID',
  usage: 'id [user]'
};

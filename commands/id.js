exports.run = (client, message) => {
  const user = message.mentions.users.first() || message.author;
  message.channel.send(user + `'s ID is ${user.id}`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
};

exports.help = {
  name: 'id',
  description: "Gets a user's ID",
  usage: 'id [user]',
};

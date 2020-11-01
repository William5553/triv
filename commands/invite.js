exports.run = (client, message) => {
  message.channel.send(`My invite link is: https://discordapp.com/oauth2/authorize?permissions=2146958591&client_id=${client.user.id}&scope=bot`);
};


exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['inv'],
  permLevel: 0
};

exports.help = {
  name: 'invite',
  description: 'Gives you an invite link for me.',
  usage: 'invite'
};

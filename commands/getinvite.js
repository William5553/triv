exports.run = (client, message, args) => {
  let guildid = args.slice(0).join(' ');
  if (message.author.id !== '186620503123951617') return;
  //if (guildid.length < 1) return message.reply('Guild ID?');
  message.guild.channels.get(message.guild.id).createInvite().then(invite => // how u do da maxage
    message.author.send(invite.url + ' ' + message.guild.name + ' (only usable for 24 hrs)'));

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 4
};

exports.help = {
  name: 'getinv',
  description: 'Creates an invite',
  usage: 'getinv [guildid]'
};

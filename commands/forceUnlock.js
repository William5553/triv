exports.run = (client, message, args) => {
const chan = message.guild.channels.cache.resolve(args[0]);
if (!chan) return message.reply('please specify a valid channel id');
chan.updateOverwrite(chan.guild.roles.everyone, { SEND_MESSAGES: null }).then(message.channel.send('Lockdown lifted.')).catch(console.error);
chan.send(`force unlocked by @${message.author.tag}`);
  if (client.lockit[chan.id]) delete client.lockit[chan.id];
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['fu'],
  permLevel: 3
};

exports.help = {
  name: 'forceunlock',
  description: 'This will lock a channel down for the specified duration, disallowing members to speak.',
  usage: 'forceunlock [channel id]'
};

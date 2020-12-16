exports.run = async (client, message, args) => {
  if (!args || isNaN(args[0]) return message.reply('tell me a number next time, moron');
  if (Number(args[0]) > 3600) return message.reply('the countdown cannot be for more than an hour');
  message.channel.send('Countdown started');
  await client.wait(Number(args[0]) * 1000);
  message.channel.send('Countdown finished');
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'countdown',
  description: "Starts a timer",
  usage: 'countdown [seconds]'
};

exports.run = async (client, message, args) => {
  await message.delete(); // delete the command message, so it doesn't interfere with the messages we are going to delete.
  let mgct = Number(args.slice(0).join(' '));
  if (isNaN(mgct)) return message.channel.send("that's not a number");
  if (mgct < 1) return message.reply('enter a number of 1 or higher');
  if (mgct > 99) mgct = 100;
  message.channel.bulkDelete(mgct, true).catch(error => {
    message.reply(`**${error}**`).then(m => m.delete({ timeout: 4500 }));
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['prune'],
  permLevel: 2
};

exports.help = {
  name: 'purge',
  description: 'Deletes the specified amount of messages.',
  usage: 'purge [amount]'
};

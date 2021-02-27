exports.run = async (client, message, args) => {
  if (args.length < 2) return message.reply(`usage: ${process.env.prefix}${exports.help.usage}`);
  let m;
  try {
    m = await message.channel.messages.fetch(args[0]);
  } catch (e) {
    return message.reply('cannot find message.');
  }
  if (!m) return message.reply('message could not be found.');
  message.delete();
  if (m.author.id != client.user.id) return message.reply("I didn't send that message.");
  m.edit(args.slice(1).join(' ')).catch(message.channel.send);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 10
};

exports.help = {
  name: 'edit',
  description: 'Edits a message sent by the bot',
  usage: 'edit [message id] [content]'
};

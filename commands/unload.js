exports.run = async (client, message, args) => {
  if (!args[0]) return message.reply('specify a command to unload boomer');
  const res = client.unloadCommand(args[0]);
  if (res === false) return message.channel.send(`Unloaded ${args[0]}`);
  else message.channel.send(res);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'unload',
  description: 'Unloads a command',
  usage: 'unload [command]'
};

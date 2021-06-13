exports.run = async (client, message, args) => {
  if (!args[0]) return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
  if (!(client.commands.has(args[0]) || client.aliases.has(args[0])))
    return message.channel.send(`I cannot find the command: ${args[0]}`);
  client.unloadCommand(args[0]).then(result => message.channel.send(result));
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 10,
  cooldown: 2500
};

exports.help = {
  name: 'unload',
  description: 'Unloads a command',
  usage: 'unload [command]',
  example: 'unload fortnite'
};

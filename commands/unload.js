exports.run = async (client, message, args) => {
  let command;
  if (client.commands.has(args[0])) command = args[0];
  else if (client.aliases.has(args[0])) command = client.aliases.get(args[0]);
  if (!command) return message.channel.send(`I cannot find the command: ${args[0]}`);
  else
    client.unloadCommand(args[0]).then(result => {
      return message.channel.send(result);
    });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 10
};

exports.help = {
  name: 'unload',
  description: 'Unloads a command',
  usage: 'unload [command]'
};

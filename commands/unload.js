exports.run = async (client, message, args) => {
  if (!args[0]) return message.reply("specify a command to unload boomer");
  client.unloadCommand(args[0]).then(result => {
    return message.channel.send(result);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 4
};

exports.help = {
  name: "unload",
  description: "Unloads a command",
  usage: "unload [command]"
};

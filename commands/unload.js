exports.run = (client, message, args) => {
const cmd = args[0];
  const oof = client.unloadCommand(cmd);
  if (oof === false) {
    message.channel.send(`${cmd} unloaded`);
    } else {
      message.channel.send(`Error: **${oof}**`);
    }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 4
};

exports.help = {
  name: 'unload',
  description: 'Unloads the command file.',
  usage: 'unload <commandname>'
};

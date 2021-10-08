exports.run = (client, message, args) => {
  if (args.length === 0) return message.channel.send('What command should I load, moron?');
  const command = args[0];
  message.channel.send(`Loading: ${command}`).then(m => {
    client
      .loadCommand(command)
      .then(() => m.edit(`Successfully loaded: ${command}`))
      .catch(error => m.edit(`Command load failed: ${command}\n\`\`\`${error.stack}\`\`\``));
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 10
};

exports.help = {
  name: 'load',
  description: 'Loads a command if it was unloaded or load a new command',
  usage: 'load [command]'
};

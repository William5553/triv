exports.run = (client, message, args) => {
  const settings = require("../settings.json");
  const command = args[0];
  if (!command)
    return message.channel.send(`I cannot find the command: ${args[0]}`);
  else
    message.channel.send(`Loading: ${command}`).then(m => {
      client
        .load(command)
        .then(() => {
          m.edit(`Successfully loaded: ${command}`);
        })
        .catch(e => {
          m.edit(`Command load failed: ${command}\n\`\`\`${e.stack}\`\`\``);
        });
    });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 4
};

exports.help = {
  name: "load",
  description: "Loads a command if it was unloaded",
  usage: "load [command]"
};

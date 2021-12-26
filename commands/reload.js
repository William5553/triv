const { readdir } = require('node:fs');

exports.run = async (client, message, args) => {
  if (!args[0]) return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
  if (args[0] == 'all') {
    const m = await message.channel.send('Reloading...');
    readdir('./commands/', (err, files) => {
      if (err) client.logger.error(err);
      client.logger.warn(`Reloading a total of ${files.length} commands.`);
      files.forEach(async file => {
        if (!file.endsWith('.js'))
          return client.logger.warn(`File not ending with .js found in commands folder: ${file}`);
        const re = await client.unloadCommand(file.split('.')[0]);
        if (re) client.logger.warn(re);
        const res = await client.loadCommand(file);
        if (res) client.logger.warn(res);
      });
      m.edit('Reloaded.');
    });
  } else {
    let command;
    if (client.commands.has(args[0]))
      command = args[0];
    else if (client.aliases.has(args[0]))
      command = client.aliases.get(args[0]);
    if (!command)
      return message.channel.send(`I cannot find the command: ${args[0]}`);
    else
      message.channel.send(`Reloading: ${command}`).then(m => {
        client
          .unloadCommand(command)
          .then(() => client.loadCommand(command))
          .then(() => m.edit(`Successfully reloaded: ${command}`))
          .catch(error => m.edit(`Command reload failed: ${command}\n\`\`\`${error.stack ?? error}\`\`\``));
      });
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 10,
  cooldown: 1000
};

exports.help = {
  name: 'reload',
  description: "Reloads the command file, if it's been updated or modified.",
  usage: 'reload [command]',
  example: 'reload help'
};

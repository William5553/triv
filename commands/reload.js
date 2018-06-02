const fs = require('fs');
const settings = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));
exports.run = (client, message, args) => {
  if (message.author.id !== settings.ownerid) return message.reply('You are not my master!');
  let command;
  if (client.commands.has(args[0])) {
    command = args[0];
  } else if (client.aliases.has(args[0])) {
    command = client.aliases.get(args[0]);
  }
  if (!command) {
    return message.channel.send(`I cannot find the command: ${args[0]}`);
  } else {
    message.channel.send(`Reloading: ${command}`)
      .then(m => {
        client.reload(command)
          .then(() => {
            m.edit(`Successfully reloaded: ${command}`);
          })
          .catch(e => {
            m.edit(`Command reload failed: ${command}\n\`\`\`${e.stack}\`\`\``);
          });
      });
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 4
};

exports.help = {
  name: 'reload',
  description: 'Reloads the command file, if it\'s been updated or modified.',
  usage: 'reload <commandname>'
};

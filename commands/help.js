const settings = require('../settings.json');
exports.run = (client, message, args) => {
  if (!args[0]) {
    const commandNames = Array.from(client.commands.keys());
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
    const msg = `= Command List =\n\n[Use ${settings.prefix}help <commandname> for details]\n\n${client.commands
      .map(c => `${settings.prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}`)
      .join('\n')}`;
    for (i = 0; i * 1980 <= msg.length; i++) {
      message.author
        .send(`${msg.substring(i * 1980, i * 1980 + 1980)}`, {
          code: 'asciidoc',
        })
        .catch(client.logger.error);
    }
    message.channel.send('Help sent to your DMs! :mailbox_with_mail:');
  } else {
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      message.channel.send(`= ${command.help.name} = \n${command.help.description}\nusage :: ${command.help.usage}`, {
        code: 'asciidoc',
      });
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
};

exports.help = {
  name: 'help',
  description: 'Displays all the available commands for your permission level.',
  usage: 'help [command]',
};

const settings = require('../settings.json');
exports.run = (client, message, args) => {
  if (!args[0]) {
    const commandNames = Array.from(client.commands.keys());
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
    let yes = client.commands.map(c => `${settings.prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}`).join('\n');
    let yes2 = null;
    if (yes.length >= 1920) {
      yes = `${yes.substr(0, 1920)}`;
      yes2 = `${yes.substr(1921)}`;
    }
    message.channel.send('Help sent to your DMs! :mailbox_with_mail:');
    message.author.send(`= Command List =\n\n[Use ${settings.prefix}help <commandname> for details]\n\n${yes}`, {code: 'asciidoc'}).catch(err => {
      client.logger.error(err);
      message.author.send(err);
    });
    if (yes2) {
      message.author.send(yes2, {code: 'asciidoc'}).catch(client.logger.error);
    }
  } else {
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      message.channel.send(`= ${command.help.name} = \n${command.help.description}\nusage :: ${command.help.usage}`, {code:'asciidoc'});
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'help',
  description: 'Displays all the available commands for your permission level.',
  usage: 'help [command]'
};

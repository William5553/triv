const ms = require('ms');

exports.run = (client, message, args, perms) => {
  if (!args[0]) {
    const longest = Array.from(client.commands.keys()).reduce((long, str) => Math.max(long, str.length), 0);
    const fonk = client.commands.map(c => {
      if (perms < c.conf.permLevel)
        return null;
      else
        return `${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}`;
    })
      .filter(a => a !== null)
      .join('\n');
    const m =`= Command List =\n\n[Use ${process.env.prefix}help <commandname> for details]\n\n${fonk}`;
    for (let i = 0; i * 1980 <= m.length; i++) {
      message.author
        .send(m.substring(i * 1980, i * 1980 + 1980), { code: 'asciidoc' })
        .catch(client.logger.error);
    }
    if (message.guild) message.channel.send('Help sent to your DMs! :mailbox_with_mail:');
  } else {
    let command;
    if (client.commands.has(args[0]))
      command = client.commands.get(args[0]);
    else if (client.aliases.has(args[0]))
      command = client.commands.get(client.aliases.get(args[0]));
    if (!command) return message.channel.send(`${args[0]} is not a valid command`);
    message.channel.send(`= ${command.help.name} = \n${command.help.description}\nusage    :: ${process.env.prefix}${command.help.usage}\naliases  :: ${command.conf.aliases.join(', ') || 'none'}\nexample  :: ${command.help.example ? `${process.env.prefix}${command.help.example}` : 'no example provided'}\ncooldown :: ${command.conf.cooldown ? ms(command.conf.cooldown) : '0s'}`, { code: 'asciidoc' });
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['commands', 'usage'],
  permLevel: 0,
  cooldown: 1500
};

exports.help = {
  name: 'help',
  description: 'Displays all the available commands for your permission level. If used in DMs, shows all commands',
  usage: 'help [command]'
};

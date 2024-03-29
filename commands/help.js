const ms = require('ms');
const { MessageEmbed } = require('discord.js');
const { splitMessage } = require('../util/Util');
const perm = {
  0: 'Member',
  2: 'Moderator',
  3: 'Administrator',
  4: 'Guild Owner',
  10: 'Bot Owner'
};

exports.run = (client, message, args, perms) => {
  try {
    if (args[0]) {
      let command;
      if (client.commands.has(args[0]))
        command = client.commands.get(args[0]);
      else if (client.aliases.has(args[0]))
        command = client.commands.get(client.aliases.get(args[0]));
      if (!command) return message.channel.send(`${args[0]} is not a valid command`);
      message.channel.send({embeds: [
        new MessageEmbed()
          .setTitle(`= **${command.help.name}** =`)
          .addFields([
            { name: 'Description', value: command.help.description },
            { name: 'Usage', value: command.help.usage },
            { name: 'Aliases', value: command.conf.aliases.join(', ') || 'No aliases' },
            { name: 'Cooldown', value: command.conf.cooldown ? ms(command.conf.cooldown) : '0s' },
            { name: 'Example', value: command.help.example || 'No examples' },
            { name: 'Permissions', value: perm[command.conf.permLevel] }
          ])
      ]});
    } else {
      const longest = [...client.commands.keys()].reduce((long, str) => Math.max(long, str.length), 0);
      const fonk = client.commands.filter(command => command.conf.permLevel < perms)
        .map(c => `${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}`)
        .join('\n');
      const splat = splitMessage(`\`\`\`asciidoc\n= Command List =\n\n[Use help <commandname> for details]\n\n${fonk}\`\`\``, { prepend: '```asciidoc\n', append: '```' });
      for (const msg of splat)
        message.author.send(msg);
      if (message.guild) message.channel.send('Help sent to your DMs! :mailbox_with_mail:');
    }
  } catch (error) {
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor('#FF0000')
        .setTimestamp()
        .setTitle('Please report this on GitHub')
        .setURL('https://github.com/william5553/triv/issues')
        .setDescription(`**Stack Trace:**\n\`\`\`${error.stack ?? error}\`\`\``)
        .addFields({ name: '**Command:**', value: message.content })
    ]});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['commands', 'usage', 'halp'],
  permLevel: 0,
  cooldown: 2000
};

exports.help = {
  name: 'help',
  description: 'Displays all the available commands for your permission level. If used in DMs, shows all commands',
  usage: 'help [command]',
  example: 'help help'
};

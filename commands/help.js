const ms = require('ms');
const { MessageEmbed } = require('discord.js');

exports.run = (client, message, args, perms) => {
  try {
    if (!args[0]) {
      const longest = Array.from(client.commands.keys()).reduce((long, str) => Math.max(long, str.length), 0);
      const fonk = client.commands.map(c => {
        return perms < c.conf.permLevel ? null : `${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}`;
      })
        .filter(a => a !== null)
        .join('\n');
      const m =`= Command List =\n\n[Use help <commandname> for details]\n\n${fonk}`;
      message.author.send(m, { code: 'asciidoc', split: true }).catch(message.channel.send);
      if (message.guild) message.channel.send('Help sent to your DMs! :mailbox_with_mail:');
    } else {
      let command;
      if (client.commands.has(args[0]))
        command = client.commands.get(args[0]);
      else if (client.aliases.has(args[0]))
        command = client.commands.get(client.aliases.get(args[0]));
      if (!command) return message.channel.send(`${args[0]} is not a valid command`);
      message.channel.send(`= ${command.help.name} = \n${command.help.description}\nusage    :: ${command.help.usage}\naliases  :: ${command.conf.aliases.join(', ') || 'none'}\nexample  :: ${command.help.example || 'no example provided'}\ncooldown :: ${command.conf.cooldown ? ms(command.conf.cooldown) : '0s'}`, { code: 'asciidoc' });
    }
  } catch (err) {
    return message.channel.send(new MessageEmbed()
      .setColor('#FF0000')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`**Stack Trace:**\n\`\`\`${err.stack}\`\`\``)
      .addField('**Command:**', `${message.content}`)
    );
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['commands', 'usage', 'halp'],
  permLevel: 0,
  cooldown: 1500
};

exports.help = {
  name: 'help',
  description: 'Displays all the available commands for your permission level. If used in DMs, shows all commands',
  usage: 'help [command]'
};

const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    if (!args[0]) return message.reply(`usage: ${client.getPrefix(message)}${exports.help.usage}`);
    let command;
    if (client.commands.has(args[0]))
      command = args[0];
    else if (client.aliases.has(args[0]))
      command = client.aliases.get(args[0]);
    
    if (!command) return message.reply(`${args[0]} is not a valid command`);

    if (client.guildData.includes(message.guild.id, command, 'disabled')) {
      client.guildData.remove(message.guild.id, command, 'disabled');
      message.channel.send(`Enabled \`${command}\``);
    } else {
      client.guildData.push(message.guild.id, command, 'disabled');
      message.channel.send(`Disabled \`${command}\``);
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
  guildOnly: true,
  aliases: ['enable'],
  permLevel: 3,
  cooldown: 1000
};

exports.help = {
  name: 'disable',
  description: 'Disables and enables commands for the guild',
  usage: 'disable [command] OR enable [command]',
  example: 'disable fortnite'
};

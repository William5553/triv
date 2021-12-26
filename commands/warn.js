const { MessageEmbed } = require('discord.js');
const { parseUser, caseNumber } = require('../util/Util');

exports.run = async (client, message, args) => {
  try {
    if (args.length < 2) return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
    const reason = args.slice(1).join(' ');
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLowerCase());
    
    if (!member) return message.reply('Tell me who to warn, idiot');
    if (reason.length === 0) return message.reply('Supply a reason for the warning.');
    if (parseUser(message, member) !== true) return;

    message.channel.send(`Warned ${member.toString()} for **${reason}**`);

    client.infractions.ensure(message.guild.id, { [member.id]: [] });
    client.infractions.push(message.guild.id, {type: 'Warn', timestamp: Date.now(), reason, mod: message.author.id}, member.id);

    if (client.settings.get(message.guild.id).logsID) {
      const botlog = message.guild.channels.resolve(client.settings.get(message.guild.id).logsID);
      const caseNum = await caseNumber(client, botlog);
      return botlog.send({embeds: [
        new MessageEmbed()
          .setColor(0x00_AE_86)
          .setTimestamp()
          .setFooter(`ID ${caseNum} | User ID: ${member.id}`)
          .setDescription(`**Action:** Warning\n**Moderator:** ${message.author.toString()}\n**Target:** ${member.user.toString()}\n**Reason:** ${reason}`)
      ]});
    }
  } catch (error) {
    return message.channel.send({embeds: [new MessageEmbed()
      .setColor('#FF0000')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`**Stack Trace:**\n\`\`\`${error.stack ?? error}\`\`\``)
      .addField('**Command:**', message.content)
    ]});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 2,
  cooldown: 1000
};

exports.help = {
  name: 'warn',
  description: 'Issues a warning to the mentioned user.',
  usage: 'warn [user] [reason]',
  example: 'warn @User swearing'
};

const { MessageEmbed } = require('discord.js');
const { parseUser, caseNumber } = require('../util/Util');

exports.run = async (client, message, args) => {
  try {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLowerCase());
    if (!member) return message.reply('Tag someone to kick next time before I kick you');
    if (args.length < 2) return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
    if (parseUser(message, member) !== true) return;

    const reason = args.slice(1).join(' ');
    await member.user.send(`You've been kicked from ${message.guild.name} by ${message.author}${reason ? ` for ${reason}` : ''}`);
    message.guild.members.kick(member, reason);
    message.channel.send(`Kicked ${member.toString()}`);

    client.infractions.ensure(message.guild.id, { [member.id]: [] });
    client.infractions.push(message.guild.id, {type: 'Kick', timestamp: Date.now(), reason, mod: message.author.id}, member.id);

    if (client.settings.get(message.guild.id).logsID) {
      const botlog = message.guild.channels.resolve(client.settings.get(message.guild.id).logsID);
      const caseNum = await caseNumber(client, botlog);
  
      return botlog.send({embeds: [
        new MessageEmbed()
          .setColor(0x00_AE_86)
          .setTimestamp()
          .setDescription(`**Action:** Kick\n**Target:** ${member.user.toString()}\n**Moderator:** ${message.author.toString()}\n**Reason:** ${reason || `Awaiting moderator's input. Use ${client.getPrefix(message)}reason ${caseNum} <reason>.`}`)
          .setFooter({ text: `ID ${caseNum} | **User ID:** ${member.user.id}` })
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
  name: 'kick',
  description: 'Kicks the mentioned user.',
  usage: 'kick [user] [reason]',
  example: 'kick @Spammer spamming'
};
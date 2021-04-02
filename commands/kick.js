const { MessageEmbed } = require('discord.js');
const { parseUser, caseNumber } = require('../util/Util');

exports.run = async (client, message, args) => {
  try {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLowerCase());
    if (!member) return message.reply('tag someone to kick next time before I kick you');
    if (parseUser(message, member) !== true) return;

    const reason = args.splice(1).join(' ');
    await member.user.send(`you've been kicked from ${message.guild.name} by ${message.author}${reason ? ` for ${reason}` : ''}`).catch(client.logger.error);
    member.kick().catch(client.logger.error);
    message.channel.send(`Kicked ${member.user}`);

    if (client.settings.get(message.guild.id).logsID) {
      const botlog = message.guild.channels.resolve(client.settings.get(message.guild.id).logsID);
      const caseNum = await caseNumber(client, botlog);
  
      return botlog.send(new MessageEmbed()
        .setColor(0x00ae86)
        .setTimestamp()
        .setDescription(
          `**Action:** Kick\n**Target:** ${member.user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason || `Awaiting moderator's input. Use ${client.getPrefix(message)}reason ${caseNum} <reason>.`}\n**User ID:** ${member.user.id}`
        )
        .setFooter(`ID ${caseNum}`)
      ).catch(client.logger.error);
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
  aliases: [],
  guildOnly: true,
  permLevel: 2
};

exports.help = {
  name: 'kick',
  description: 'Kicks the mentioned user.',
  usage: 'kick [user] [reason]'
};
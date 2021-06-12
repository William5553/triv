const { MessageEmbed, Permissions } = require('discord.js');
const { caseNumber, parseUser } = require('../util/Util');

exports.run = async (client, message, args) => { 
  if (args.length < 2) return message.reply(`usage: ${client.getPrefix(message)}${exports.help.usage}`);
  if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
    return message.reply("you don't have the permission **BAN MEMBERS**");
  try {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLowerCase());
    if (!member) return message.reply('you must mention someone to ban them.');
    if (parseUser(message, member) !== true) return;
    if (member.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
      return message.reply('the person you tried to also has the ban members permission, sorry.');
    if (!member.bannable) return message.reply("I can't ban that user");
    const reason = args.slice(1).join(' ');
    await member.user.send(`you've been banned from ${message.guild.name} by ${message.author}${reason ? ` for ${reason}` : ''}`);
    message.guild.members.ban(member, { days: 0, reason: reason });
    message.channel.send(`Banned ${member.user}`);

    client.infractions.ensure(message.guild.id, { [member.id]: [] });
    client.infractions.push(message.guild.id, {'type': 'Ban', 'timestamp': Date.now(), 'reason': reason, 'mod': message.author.id}, member.id);

    if (client.settings.get(message.guild.id).logsID) {
      const botlog = message.guild.channels.resolve(client.settings.get(message.guild.id).logsID);
      const caseNum = await caseNumber(client, botlog);
      return botlog.send({embeds: [new MessageEmbed()
        .setColor(0x00ae86)
        .setTimestamp()
        .setDescription(
          `**Action:** Ban\n**Target:** ${member.user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason || `Awaiting moderator's input. Use ${client.getPrefix(message)}reason ${caseNum} <reason>.`}\n**User ID:** ${member.user.id}`
        )
        .setFooter(`ID ${caseNum} | User ID: ${member.user.id}`)
      ]});
    }
  } catch (err) {
    return message.channel.send({embeds: [new MessageEmbed()
      .setColor('#FF0000')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`**Stack Trace:**\n\`\`\`${err.stack || err}\`\`\``)
      .addField('**Command:**', `${message.content}`)
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
  name: 'ban',
  description: 'Bans the mentioned user.',
  usage: 'ban [user] [reason]',
  example: 'ban @Joe repeated spamming'
};
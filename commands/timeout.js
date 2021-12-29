const { MessageEmbed, Permissions } = require('discord.js');
const { caseNumber, parseUser } = require('../util/Util');
const ms = require('ms');

exports.run = async (client, message, args) => { 
  if (args.length < 3) return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
  if (!message.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS))
    return message.reply("You don't have the permission **TIMEOUT MEMBERS**");
  try {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLowerCase());
    if (!member) return message.reply('You must mention someone to time them out.');
    const timeout = ms(args[1]);
    if (!timeout || Number.isNaN(timeout)) return message.reply('The time you provided was invalid');
    if (timeout >= 2_419_200_000) return message.reply('The timeout length must be under 28 days.');
    if (parseUser(message, member) !== true) return;
    if (member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS))
      return message.reply('The person you tried to also has the timeout members permission, sorry.');
    if (!member.moderatable) return message.reply("I can't timeout that user");
    const reason = args.slice(2).join(' ');
    member.user.send(`You've been timed out in ${message.guild.name} (${message.guild.id}) by ${message.author}${reason ? ` for ${reason}` : ''}`);
    await member.timeout(timeout, reason);
    message.channel.send(`Timed out ${member.toString()}`);

    client.infractions.ensure(message.guild.id, { [member.id]: [] });
    client.infractions.push(message.guild.id, {type: 'Timeout', timestamp: Date.now(), reason, mod: message.author.id, additional: [{ title: 'Timed out until', body: `<t:${Math.round(member.communicationDisabledUntilTimestamp/1000)}>` }, { title: 'Length', body: ms(timeout) }]}, member.id);

    if (client.settings.get(message.guild.id).logsID) {
      const botlog = message.guild.channels.resolve(client.settings.get(message.guild.id).logsID);
      const caseNum = await caseNumber(client, botlog);
      return botlog.send({embeds: [
        new MessageEmbed()
          .setColor(0x00_AE_86)
          .setTimestamp()
          .setDescription(`**Action:** Timeout\n**Target:** ${member.user.toString()}\n**Moderator:** ${message.author.toString()}\n**Reason:** ${reason || `Awaiting moderator's input. Use ${client.getPrefix(message)}reason ${caseNum} <reason>.`}\n**Timed out until:** <t:${Math.round(member.communicationDisabledUntilTimestamp/1000)}>\n**Length:** ${ms(timeout)}`)
          .setFooter({ text: `ID ${caseNum} | User ID: ${member.user.id}` })
      ]});
    }
  } catch (error) {
    return message.channel.send({embeds: [
      new MessageEmbed()
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
  aliases: ['to'],
  permLevel: 2,
  cooldown: 1000
};

exports.help = {
  name: 'timeout',
  description: 'Puts the mentioned user in time out.',
  usage: 'timeout [user] [timeout length] [reason]',
  example: 'timeout @Joe repeated spamming'
};
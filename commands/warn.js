const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { parseUser, caseNumber } = require('../util/Util');

exports.run = async (client, message, args) => {
  let warnings;
  try {
    warnings = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'warnings.json'), 'utf-8'));
  } catch {
    fs.writeFile('warnings.json', '{}', e => {
      if (e) throw e;
    });
    await client.wait(750);
    warnings = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'warnings.json'), 'utf-8'));
  }
  try {
    if (args.length < 2) return message.reply(`usage: ${process.env.prefix}${exports.help.usage}`);
    const reason = args.slice(1).join(' '),
      member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLowerCase()),
      botlog = message.guild.channels.cache.find(channel => channel.name === 'bot-logs');
    if (!member) return message.reply('tell me who to warn, idiot').catch(client.logger.error);
    if (!botlog && message.guild.me.hasPermission('MANAGE_CHANNELS'))
      message.guild.channels.create('bot-logs', { type: 'text' });
    else if (!botlog)
      return message.reply('I cannot find a bot-logs channel');
    if (reason.length < 1) return message.reply('supply a reason for the warning');
    if (parseUser(message, member) !== true) return;
    message.channel.send(`Warned ${member} for **${reason}**`);
    if (!warnings[message.guild.id])
      warnings[message.guild.id] = {};
    if (!warnings[message.guild.id][member.id])
      warnings[message.guild.id][member.id] = {};
    if (!warnings[message.guild.id][member.id].warnings)
      warnings[message.guild.id][member.id].warnings = [];
    warnings[message.guild.id][member.id].warnings.push({'timestamp': Date.now(), 'reason': reason, 'modid': message.author.id});
    fs.writeFile(path.resolve(process.cwd(), 'warnings.json'), JSON.stringify(warnings), err => {
      if (err) client.logger.error(err);
    });
    const caseNum = await caseNumber(client, botlog);
    return botlog
      .send(new MessageEmbed()
        .setColor(0x00ae86)
        .setTimestamp()
        .setFooter(`ID ${caseNum}`)
        .setDescription(`**Action:** Warning\n**Moderator:** ${message.author.tag}\n**Target:** ${member.user.tag}\n**Target's User ID:** ${member.user.id}\n**Reason:** ${reason}`)
      )
      .catch(client.logger.error);
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
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: 'warn',
  description: 'Issues a warning to the mentioned user.',
  usage: 'warn [user] [reason]'
};

const { MessageEmbed } = require('discord.js'),
  fs = require('fs'),
  path = require('path'),
  { parseUser } = require('../util/parseUser.js');

exports.run = (client, message, args) => {
  const reason = args.slice(1).join(' '),
    userr = message.mentions.members.first() || message.guild.members.fetch(args[0]),
    botlog = message.guild.channels.cache.find(channel => channel.name === 'bot-logs');
  let warnings;
  try {
    warnings = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'warnings.json'), 'utf-8'));
  } catch {
    await fs.writeFile('warnings.json', '{}', e => {
      if (e) throw e;
    });
    warnings = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'warnings.json'), 'utf-8'));
  }
  if (!botlog && message.guild.me.hasPermission('MANAGE_CHANNELS'))
    message.guild.channels.create('bot-logs', { type: 'text' });
  else if (!botlog)
    return message.reply('I cannot find a bot-logs channel');
  if (reason.length < 1) return message.reply('supply a reason for the warning');
  if (!userr) return message.reply('tell me who to warn, idiot').catch(client.logger.error);
  if (parseUser(message, userr) !== true) return;
  message.channel.send(`Warned ${userr} for **${reason}**`);
  if (!warnings[message.guild.id])
    warnings[message.guild.id] = {};
  if (!warnings[message.guild.id][userr.id])
    warnings[message.guild.id][userr.id] = {};
  if (!warnings[message.guild.id][userr.id].warnings)
    warnings[message.guild.id][userr.id].warnings = [];
  warnings[message.guild.id][userr.id].warnings.push({'timestamp': Date.now(), 'reason': reason, 'modid': message.author.id});
  fs.writeFile(path.resolve(process.cwd(), 'warnings.json'), JSON.stringify(warnings), err => {
    if (err) client.logger.error(err);
  }); 
  return botlog
    .send(new MessageEmbed()
      .setColor(0x00ae86)
      .setTimestamp()
      .setDescription(`**Action:** Warning\n**Moderator:** ${message.author.tag}\n**Target:** ${userr.user.tag}\n**Target's User ID:** ${userr.user.id}\n**Reason:** ${reason}`)
    )
    .catch(client.logger.error);
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
  usage: 'warn [mention] [reason]'
};

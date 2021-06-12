const { MessageEmbed, Permissions } = require('discord.js');
const { parseUser, caseNumber } = require('../util/Util');

exports.run = async (client, message, args) => {
  try {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLowerCase());
    if (!member) return message.reply('you must mention someone to mute them').catch(client.logger.error);
    if (message.content.split(' ')[0].slice(client.getPrefix(message).length).toLowerCase() !== 'unmute')
      if (parseUser(message, member) !== true) return;
    
    let muteRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted') || message.guild.roles.resolve(client.settings.get(message.guild.id).muteRoleID);

    if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES))
      return message.reply('I do not have the **MANAGE_ROLES** permission').catch(client.logger.error);

    if (message.guild.me.roles.highest.comparePositionTo(muteRole) < 1) return message.reply("I don't have control over the muted role, move my role above the muted role.");

    if (!muteRole) {
      muteRole = await message.guild.roles.create({ name: 'muted', color: [255, 0, 0] });
      client.settings.set(message.guild.id, muteRole.id, 'muteRoleID');
    }

    if (!client.settings.get(message.guild.id).muteRoleID) 
      client.settings.set(message.guild.id, muteRole.id, 'muteRoleID');

    const reason = args.slice(1).join(' ');

    message.guild.channels.cache.forEach(chan => {
      chan.updateOverwrite(muteRole, {
        SEND_MESSAGES: false
      });
    });
 
    if (member.roles.cache.has(muteRole.id)) {
      member.roles
        .remove(muteRole.id, reason)
        .then(async () => {
          message.channel.send(`Unmuted ${member.user}`);
          client.infractions.ensure(message.guild.id, { [member.id]: [] });
          client.infractions.push(message.guild.id, {'type': 'Mute', 'timestamp': Date.now(), 'reason': reason, 'mod': message.author.id}, member.id);
          if (client.settings.get(message.guild.id).logsID) {
            const botlog = message.guild.channels.resolve(client.settings.get(message.guild.id).logsID);
            const caseNum = await caseNumber(client, botlog);
            botlog.send({embeds: [new MessageEmbed()
              .setColor(0x00ae86)
              .setTimestamp()
              .setDescription(`**Action:** Unmute\n**Target:** ${member.user.tag}\n**Moderator:** ${message.author.tag}\n**User ID:** ${member.user.tag}`)
              .setFooter(`ID ${caseNum}`)
            ]});
          }
        });
    } else {
      member.roles
        .add(muteRole.id, reason)
        .then(async () => {
          message.channel.send(`Muted ${member.user}`);
          client.infractions.ensure(message.guild.id, { [member.id]: [] });
          client.infractions.push(message.guild.id, {'type': 'Unmute', 'timestamp': Date.now(), 'reason': reason, 'mod': message.author.id}, member.id);
          if (client.settings.get(message.guild.id).logsID) {
            const botlog = message.guild.channels.resolve(client.settings.get(message.guild.id).logsID);
            const caseNum = await caseNumber(client, botlog);
            botlog.send({embeds: [new MessageEmbed()
              .setColor(0x00ae86)
              .setTimestamp()
              .setDescription(`**Action:** Mute\n**Target:** ${member.user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}\n**User ID:** ${member.user.tag}`)
              .setFooter(`ID ${caseNum}`)
            ]});
          }
        });
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
  aliases: ['unmute'],
  permLevel: 2,
  cooldown: 1000
};

exports.help = {
  name: 'mute',
  description: 'Toggles the mute of a member',
  usage: 'mute [user] [reason] OR unmute [user] [reason]',
  example: 'mute @Spammer spamming'
};

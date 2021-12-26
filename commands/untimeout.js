const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  if (args.length < 2) return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
  const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLowerCase());
  if (!member) return message.reply('You must mention someone.');
  const reason = args.slice(1).join(' ');

  if (reason.length === 0) return message.reply('You must supply a reason.');
  if (member.communicationDisabledUntilTimestamp === null) return message.reply('That user is not timed out.');

  // eslint-disable-next-line unicorn/no-null
  member.timeout(null, reason);
  message.channel.send(`Untimedout ${member.toString()}`);
  
  client.infractions.ensure(message.guild.id, { [member.id]: [] });
  client.infractions.push(message.guild.id, {type: 'Unban', timestamp: Date.now(), reason: reason, mod: message.author.id}, member.id);

  if (client.settings.get(message.guild.id).logsID) {
    const botlog = message.guild.channels.resolve(client.settings.get(message.guild.id).logsID);
    return botlog.send({embeds: [
      new MessageEmbed()
        .setColor(0x00_AE_86)
        .setTimestamp()
        .setDescription(`**Action:** Unban\n**Target:** ${member.toString()}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`)
        .setFooter(`User ID: ${member.id}`)
    ]});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['unto'],
  permLevel: 2,
  cooldown: 1000
};

exports.help = {
  name: 'untimeout',
  description: 'Untimeout the provided user',
  usage: 'untimeout [user] [reason]'
};

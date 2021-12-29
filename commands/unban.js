const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  const user = args[0];
  const reason = args.slice(1).join(' ');

  if (!user || Number.isNaN(user)) return message.reply('You must supply a user ID.');
  if (reason.length === 0) return message.reply('You must supply a reason for the unban.');
  let banned;
  try {
    banned = await message.guild.bans.fetch(user);
  } catch {
    return message.reply('That user is not banned');
  }
  if (!banned.user) return message.reply('That user is not banned');
  message.guild.bans.remove(user, reason);
  message.channel.send(`Unbanned ${banned.user}${banned.reason ? ` who was previously banned for ${banned.reason}` : ''}`);
  
  client.infractions.ensure(message.guild.id, { [user.id]: [] });
  client.infractions.push(message.guild.id, {type: 'Unban', timestamp: Date.now(), reason, mod: message.author.id}, user.id);

  if (client.settings.get(message.guild.id).logsID) {
    const botlog = message.guild.channels.resolve(client.settings.get(message.guild.id).logsID);
    return botlog.send({embeds: [
      new MessageEmbed()
        .setColor(0x00_AE_86)
        .setTimestamp()
        .setDescription(`**Action:** Unban\n**Target:** ${banned.toString()}\n**Moderator:** ${message.author.toString()}\n**Reason:** ${reason}`)
        .setFooter({ text: `User ID: ${banned.user.id}` })
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
  name: 'unban',
  description: 'Unbans the provided user',
  usage: 'unban [user id] [reason]'
};

const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLowerCase()) || message.member;
  const user = member.user;
  
  if (!client.infractions.has(message.guild.id) || !client.infractions.has(message.guild.id, user.id))
    return message.channel.send(`${user} has 0 infractions`);

  const embeds = await genEmbeds(message, user, client.infractions.get(message.guild.id, user.id));
  if (!embeds || embeds.length === 0) return message.channel.send(`${user} has 0 infractions`);
  let currPage = 0;
  
  const emb = await message.channel.send({content: `**Current Page - ${currPage + 1}/${embeds.length}**`, embeds: [ embeds[currPage] ]});
  if (embeds.length < 2) return;
  await emb.react('⬅️');
  await emb.react('➡️');

  const filter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && message.author.id === user.id;
  const collector = emb.createReactionCollector({ filter });
  
  collector.on('collect', async reaction => {
    try {
      if (reaction.emoji.name === '➡️') {
        if (currPage < embeds.length - 1) {
          currPage++;
          emb.edit({content: `**Current Page - ${currPage + 1}/${embeds.length}**`, embeds: [ embeds[currPage] ]});
        }
      } else if (reaction.emoji.name === '⬅️') {
        if (currPage !== 0) {
          --currPage;
          emb.edit({content: `**Current Page - ${currPage + 1}/${embeds.length}**`, embeds: [ embeds[currPage] ]});
        }
      }
      await reaction.users.remove(message.author.id);
    } catch (error) {
      client.logger.error(error.stack ?? error);
      return message.channel.send('**Missing Permissions - [ADD_REACTIONS, MANAGE_MESSAGES]!**');
    }
  });
};

const genEmbeds = (message, user, infractions) => {
  if (infractions.length === 0) return;
  const embeds = [];
  for (const infraction of infractions) {
    const mod = message.guild.members.cache.get(infraction.mod);
    const embed = new MessageEmbed()
      .setAuthor({ name: `${user.username}'s infractions`, iconURL: user.displayAvatarURL({ dynamic: true }) })
      .setFooter({ text: `Moderator: ${mod.user.tag}`, iconURL: mod.user.displayAvatarURL({ dynamic: true }) })
      .addFields([
        { name: 'Action', value: `${infraction.type ?? 'None'}`, inline: true },
        { name: 'Date', value: `<t:${Math.round(infraction.timestamp / 1000)}:f>`, inline: true }
      ])
      .setColor(0x90_2B_93);
    if (infraction.reason) embed.addFields([{ name: 'Reason', value: infraction.reason, inline: true }]);
    if (infraction.additional)
      for (const info of infraction.additional) embed.addFields([{ name: info.name, value: info.value, inline: true }]);
    embeds.push(embed);
  }
  return embeds;
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['warnings'],
  permLevel: 0,
  cooldown: 5000
};

exports.help = {
  name: 'infractions',
  description: "Gets a user's infractions",
  usage: 'infractions [user]',
  example: 'infractions @Rulebreaker'
};

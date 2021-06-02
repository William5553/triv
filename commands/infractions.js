const { MessageEmbed } = require('discord.js');
const { formatDate } = require('../util/Util');

exports.run = async (client, message, args) => {
  const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLowerCase()) || message.member;
  const user = member.user;
  
  if (!client.infractions.has(message.guild.id) || !client.infractions.has(message.guild.id, user.id))
    return message.channel.send(`${user} has 0 infractions`);

  const embeds = await genEmbeds(message, user, client.infractions.get(message.guild.id, user.id));
  if (!embeds || embeds.length < 1) return message.channel.send(`${user} has 0 infractions`);
  let currPage = 0;
  
  const emb = await message.channel.send(`**Current Page - ${currPage + 1}/${embeds.length}**`, embeds[currPage]);
  if (embeds.length < 2) return;
  await emb.react('⬅️');
  await emb.react('➡️');

  const filter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && message.author.id === user.id;
  const collector = emb.createReactionCollector(filter, {});
  
  collector.on('collect', async reaction => {
    try {
      if (reaction.emoji.name === '➡️') {
        if (currPage < embeds.length - 1) {
          currPage++;
          emb.edit(`**Current Page - ${currPage + 1}/${embeds.length}**`, embeds[currPage]);
        }
      } else if (reaction.emoji.name === '⬅️') {
        if (currPage !== 0) {
          --currPage;
          emb.edit(`**Current Page - ${currPage + 1}/${embeds.length}**`, embeds[currPage]);
        }
      }
      await reaction.users.remove(message.author.id);
    } catch (e) {
      client.logger.error(e.stack || e);
      return message.channel.send('**Missing Permissions - [ADD_REACTIONS, MANAGE_MESSAGES]!**');
    }
  });
};

function genEmbeds(message, user, infractions) {
  if (infractions.length < 1) return;
  const embeds = [];
  for (const infraction of infractions) {
    const mod = message.guild.members.cache.get(infraction.mod);
    const embed = new MessageEmbed()
      .setTitle(`${user.username}'s infractions`)
      .setAuthor(`Moderator: ${mod.user.tag}`, mod.user.displayAvatarURL({ dynamic: true }))
      .addField('Infraction', infraction.type, true)
      .setColor(0x902b93)
      .setFooter(formatDate(infraction.timestamp));
    if (infraction.reason) embed.addField('Reason', infraction.reason, true);
    if (infraction.additional) {
      infraction.additional.forEach(info => {
        embed.addField(info.title, info.body, true);
      });
    }
    embeds.push(embed);
  }
  return embeds;
}

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

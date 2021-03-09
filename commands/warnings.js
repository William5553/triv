const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

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
  
  let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLowerCase()) || message.member;
  user = user.user;
  
  if (!warnings[message.guild.id])
    warnings[message.guild.id] = {};
  if (!warnings[message.guild.id][user.id])
    warnings[message.guild.id][user.id] = {};
  if (!warnings[message.guild.id][user.id].warnings)
    warnings[message.guild.id][user.id].warnings = [];
  
  const embeds = await genEmbeds(message, user, warnings);
  if (embeds.length < 1) return message.channel.send(`${user} has 0 warnings`);
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
      client.logger.error(e.stack ? e.stack : e);
      return message.channel.send('**Missing Permissions - [ADD_REACTIONS, MANAGE_MESSAGES]!**');
    }
  });
};

function genEmbeds(message, user, warnings) {
  if (warnings[message.guild.id][user.id].warnings.size < 1)
    return message.channel.send(`${user} has 0 warnings`);
  const embeds = [];
  for (const warning of warnings[message.guild.id][user.id].warnings) {
    const mod = message.guild.members.cache.get(warning.modid);
    const embed = new MessageEmbed()
      .setTitle(`${user}'s warnings`)
      .setAuthor(`Moderator: ${mod.user.tag}`, mod.user.displayAvatarURL())
      .addField('Reason', warning.reason, true)
      .setColor(0x902b93)
      .setTimestamp(warning.timestamp);
    embeds.push(embed);
  }
  return embeds;
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['infractions'],
  permLevel: 0
};

exports.help = {
  name: 'warnings',
  description: "Gets a user's warnings",
  usage: 'warnings [user]'
};

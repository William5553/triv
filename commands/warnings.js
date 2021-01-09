const { MessageEmbed } = require('discord.js'),
  fs = require('fs'),
  path = require('path');

exports.run = async (client, message) => {
  let warnings;
  const userr = message.mentions.users.first() || message.author;
  
  try {
    warnings = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'warnings.json'), 'utf-8'));
  } catch {
    await fs.writeFile('warnings.json', '{}', e => {
      if e throw e;
    });
    warnings = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'warnings.json'), 'utf-8'));
  }
  
  if (!warnings[message.guild.id])
    warnings[message.guild.id] = {};
  if (!warnings[message.guild.id][userr.id])
    warnings[message.guild.id][userr.id] = {};
  if (!warnings[message.guild.id][userr.id].warnings)
    warnings[message.guild.id][userr.id].warnings = [];
  
  const embeds = await genEmbeds(message, userr, warnings);
  if (embeds.length < 1) return message.reply(`${userr} has 0 warnings`);
  let currPage = 0;
  
  const emb = await message.channel.send(`**Current Page - ${currPage + 1}/${embeds.length}**`, embeds[currPage]);
  if (embeds.length === 0) return;
  await emb.react('⬅️');
  await emb.react('➡️');

  const filter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && message.author.id === user.id;
  const collector = emb.createReactionCollector(filter, {
    time: 60000
  });
  
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

function genEmbeds(message, userr, warnings) {
  if (warnings[message.guild.id][userr.id].warnings.size < 1)
    return message.reply(`${userr} has 0 warnings`);
  const embeds = [];
  for (var warning of warnings[message.guild.id][userr.id].warnings) {
    const mod = message.guild.members.cache.get(warning.modid);
    const embed = new MessageEmbed()
      .setTitle(`${userr}'s warnings`)
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
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'warnings',
  description: "Gets a user's warnings",
  usage: 'warnings [user]'
};

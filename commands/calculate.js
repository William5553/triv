const mathsteps = require('mathsteps');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    const steps = mathsteps.simplifyExpression(args.join(' '));
    const embeds = await genEmbeds(message, steps);
    if (embeds.length < 1) return message.channel.send('A solution could not be found');
    let currPage = 0;
    
    const emb = await message.channel.send(`**Current Step - ${currPage + 1}/${embeds.length}**`, embeds[currPage]);
    if (embeds.length < 2) return;
    await emb.react('⬅️');
    await emb.react('➡️');
  
    const filter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && message.author.id === user.id;
    const collector = emb.createReactionCollector(filter, {
      time: 60000
    });
    
    collector.on('collect', async reaction => {
      try {
        await reaction.users.remove(message.author.id);
        if (reaction.emoji.name === '➡️') {
          if (currPage < embeds.length - 1) {
            currPage++;
            emb.edit(`**Current Step - ${currPage + 1}/${embeds.length}**`, embeds[currPage]);
          }
        } else if (reaction.emoji.name === '⬅️') {
          if (currPage !== 0) {
            --currPage;
            emb.edit(`**Current Step - ${currPage + 1}/${embeds.length}**`, embeds[currPage]);
          }
        }
      } catch (e) {
        client.logger.error(e.stack ? e.stack : e);
        return message.channel.send('**Missing Permissions - [ADD_REACTIONS, MANAGE_MESSAGES]!**');
      }
    });
  } catch (err) {
    message.channel.send(err.message ? err.message : err).catch(message.channel.send);
  }
};

function genEmbeds(message, steps) {
  if (steps.length < 1)
    return message.channel.send('A solution could not be found.');
  const embeds = [];
  for (var step of steps) {
    
    const embed = new MessageEmbed()
      .addField('Before change', step.oldNode.toString(), true)
      .addField('Change type', step.changeType, true)
      .addField('After change', step.newNode.toString(), true)
      .setColor('#FF0000')
      .setTimestamp();
    embeds.push(embed);
  }
  return embeds;
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['calc', 'solve'],
  permLevel: 0
};

exports.help = {
  name: 'calculate',
  description: 'Solves a math question',
  usage: 'calculate [expression]'
};

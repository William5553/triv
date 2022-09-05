const mathsteps = require('@william5553/mathsteps');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    const embeds = await genEmbeds(mathsteps.simplifyExpression(args.join(' ')));
    if (!embeds || embeds.length === 0) return message.channel.send('A solution could not be found');
    let currPage = 0;
    
    const emb = await message.channel.send({ content: `**Step ${currPage + 1}/${embeds.length}**`, embeds: [ embeds[currPage] ] });
    if (embeds.length < 2) return;
    await emb.react('⬅️');
    await emb.react('➡️');
  
    const filter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && message.author.id === user.id;
    const collector = emb.createReactionCollector({ filter });
    
    collector.on('collect', async reaction => {
      try {
        await reaction.users.remove(message.author);
        if (reaction.emoji.name === '➡️') {
          if (currPage < embeds.length - 1) {
            currPage++;
            emb.edit({content: `**Step ${currPage + 1}/${embeds.length}**`, embeds: [ embeds[currPage] ]});
          }
        } else if (reaction.emoji.name === '⬅️') {
          if (currPage !== 0) {
            --currPage;
            emb.edit({content: `**Step ${currPage + 1}/${embeds.length}**`, embeds: [ embeds[currPage] ]});
          }
        }
      } catch (error) {
        client.logger.error(error.stack ?? error);
        return message.channel.send('**Missing Permissions - [ADD_REACTIONS, MANAGE_MESSAGES]!**');
      }
    });
  } catch (error) {
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor('#FF0000')
        .setTimestamp()
        .setTitle('Please report this on GitHub')
        .setURL('https://github.com/william5553/triv/issues')
        .setDescription(`**Stack Trace:**\n\`\`\`${error.stack ?? error}\`\`\``)
        .addFields({ name: '**Command:**', value: message.content })
    ]});
  }
};

const genEmbeds = (steps, embeds = []) => {
  if (steps.length === 0) return embeds;
  for (const step of steps) {
    const embed = new MessageEmbed()
      .setTitle(`**${step.changeType.replace(/_/gi, ' ')}**`)
      .addField('Before change', step.oldNode.toString())
      .addField('After change', step.newNode.toString())
      .setColor('#FF0000')
      .setTimestamp();
    embeds.push(embed);
  }
  return embeds;
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['calc', 'simplify', 'evaluate', 'solve'],
  permLevel: 0,
  cooldown: 5000
};

exports.help = {
  name: 'calculate',
  description: 'Solves a math question',
  usage: 'calculate [expression]',
  example: 'calculate 2 + 2'
};

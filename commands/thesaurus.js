const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');

exports.run = async (client, message, args) => {
  if (!process.env.merriam_webster_thesaurus_key) return message.reply('The bot owner has not set up this command yet.');
  try {
    if (args.length < 1) return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
    const { body } = await request
      .get(`https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${args.join(' ')}`)
      .query({key: process.env.merriam_webster_thesaurus_key});

    const embeds = await genEmbeds(body);
    if (!embeds || embeds.length < 1) return message.reply(`Word not found, related words: **${body.join(', ')}**`);
    let currPage = 0;
  
    const emb = await message.channel.send({content: `**Word ${currPage + 1}/${embeds.length}**`, embeds: [ embeds[currPage] ]});
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
            emb.edit({content: `**Word ${currPage + 1}/${embeds.length}**`, embeds: [ embeds[currPage]] });
          }
        } else if (reaction.emoji.name === '⬅️') {
          if (currPage !== 0) {
            --currPage;
            emb.edit({content: `**Word ${currPage + 1}/${embeds.length}**`, embeds: [ embeds[currPage] ]});
          }
        }
        await reaction.users.remove(message.author.id);
      } catch (e) {
        client.logger.error(e.stack ? e.stack : e);
        return message.channel.send('**Missing Permissions - [ADD_REACTIONS, MANAGE_MESSAGES]!**');
      }
    });
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

function genEmbeds(body) {
  if (!body[0].meta) return;
  const embeds = [];
  for (const word of body) {
    const embed = new MessageEmbed()
      .setTitle(`${word.meta.id} - ${word.fl}`)
      .addField('Offensive', word.meta.offensive ? 'Yes' : 'No')
      .addField('Definition', word.shortdef)
      .addField('Synonyms', word.meta.syns.length > 0 ? word.meta.syns[0].join('\n') : 'No synonyms found')
      .addField('Antonyms', word.meta.ants.length > 0 ? word.meta.ants[0].join('\n') : 'No antonyms found');
    embeds.push(embed);
  }
  return embeds;
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['synonym', 'antonym'],
  permLevel: 0,
  cooldown: 2500
};

exports.help = {
  name: 'thesaurus',
  description: 'Gets the synonyms and antonyms of a word.',
  usage: 'thesaurus [word]',
  example: 'thesaurus smart'
};

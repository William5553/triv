const { MessageEmbed } = require('discord.js');
const fetch = require('node-superfetch');
const process = require('node:process');
const { formatNumber } = require('../util/Util');

exports.run = async (client, message, args) => {
  if (!process.env.clash_royale_key) return message.reply('The bot owner has not set up this command yet');
  if (args.length < 2) return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
  if (args[0] !== 'stats' && args[0] !== 'chests') return message.reply(`Invalid: \`${args[0]}\`, use \`stats\` or \`chests\`.`);
  if (args[1].charAt(0) !== '#') return message.reply('Player tag must start with a #.');
  try {
    const { body } = await fetch.get(`https://proxy.royaleapi.dev/v1/players/${encodeURIComponent(args[1])}${args[0] === 'chests' ? '/upcomingchests' : ''}`, {
      headers: { Authorization: `Bearer ${process.env.clash_royale_key}` }
    });

    if (args[0] == 'stats') {
      message.reply({ embeds: [
        new MessageEmbed()
          .setColor('#1C16D2')
          .setAuthor({ name: `${body.name} (${body.tag})`, iconURL: 'https://developer.clashroyale.com/favicon-192x192.6f82ec.png' })
          .addField('**Trophies**', `${body.trophies ? formatNumber(body.trophies) : 0}`)
          .addField('**Arena**', body.arena.name ?? 'Unknown')
          .addField('**King Level**', `${body.expLevel ?? 0}`)
          .addField('**Experience Points**', `${body.expPoints ? formatNumber(body.expPoints) : 0}`)
          .addField('**Wins**', `${body.wins ? formatNumber(body.wins) : 0}`)
          .addField('**Losses**', `${body.losses ? formatNumber(body.losses) : 0}`)
          .addField('**Battles**', `${body.battleCount ? formatNumber(body.battleCount) : 0}`)
          .addField('**Three Crown Wins**', `${body.threeCrownWins ? formatNumber(body.threeCrownWins) : 0}`)
          .addField('**Clan**', body.clan ? `${body.clan.name} | ${body.clan.tag}` : '*No Clan*')
          .addField('**Current Deck**', body.currentDeck.map(card => `Lvl ${card.level} ${card.name}${card.starLevel ? ` (Star Lvl ${card.starLevel})`: ''}`).join('\n') ?? 'None')
          .addField('**Current Favourite Card**', body.currentFavouriteCard.name ?? 'None')
      ]});
    } else if (args[0] == 'chests') {
      message.reply({ embeds: [
        new MessageEmbed()
          .setColor('#1C16D2')
          .setAuthor({ name: `${args[1]}`, iconURL: 'https://developer.clashroyale.com/favicon-192x192.6f82ec.png' })
          .setDescription(body.items.map(chest => `${chest.index === 0 ? 'Next Chest' : `+${chest.index}`}: **${chest.name}**`).join('\n'))
      ]});
    }
  } catch (error) {
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor('#FF0000')
        .setTimestamp()
        .setTitle('An error occurred whilst getting data')
        .setDescription(`\`\`\`${error.message ?? error}\`\`\``)
        .addFields({ name: '**Command:**', value: message.content })
    ]});
  }
};


exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['cr'],
  permLevel: 0
};

exports.help = {
  name: 'clashroyale',
  description: 'Gets clash royale stats for a player.',
  usage: 'clashroyale [stats|chests] [player tag]',
  example: 'clashroyale stats #LCLC0CY'
};

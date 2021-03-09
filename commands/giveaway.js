const ms = require('ms');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  if (!args[0]) return message.channel.send('Please enter a duration for the giveaway.');
  const time = args[0],
    prize = args.slice(1).join(' ');
  if (message.channel.type == 'news') return message.channel.send('Giveaways cannot be started in news channels');
  if (isNaN(ms(time))) return message.channel.send('The duration time is invalid');
  if (ms(time) < 1) return message.channel.send('The duration time has to be atleast 1 second');
  if (ms(time) >= 2147483647) return message.reply('specified duration is too long');
  if (prize === '') return message.channel.send('You have to enter a prize.');
  if (prize.length > 250) return message.reply('shorten the prize character count');
  message.delete();
  const msg = await message.channel.send(':tada: **GIVEAWAY** :tada:', new MessageEmbed()
    .setTitle(`${prize}`)
    .setColor(0x00ae86)
    .setDescription(
      `React with 🎉 to enter!\nTime duration: **${ms(ms(time), { long: true })}**\nHosted by: ${message.author}`
    )
    .setFooter('Ends at')
    .setTimestamp(Date.now() + ms(time, { long: true })));
  await msg.react('🎉');
  setTimeout(() => {
    msg.reactions.cache.get('🎉').users.remove(client.user.id);
    setTimeout(() => {
      const winner = msg.reactions.cache.get('🎉').users.cache.random();
      if (msg.reactions.cache.get('🎉').users.cache.size < 1) {
        msg.edit(':tada: **GIVEAWAY ENDED** :tada:', new MessageEmbed()
          .setTitle(`${prize}`)
          .setColor(0x00ae86)
          .setDescription(`No one entered the giveaway.\nHosted by: ${message.author}`)
          .setFooter('Ended at')
          .setTimestamp());
      } else {
        msg.edit(':tada: **GIVEAWAY ENDED** :tada:', new MessageEmbed()
          .setTitle(`${prize}`)
          .setColor(0x00ae86)
          .setDescription(`Winner: ${winner}\nHosted by: ${message.author}`)
          .setFooter('Ended at')
          .setTimestamp());
        message.channel.send(`${winner} won ${prize}!`);
        msg.reactions.removeAll();
      }
    }, 1000);
  }, ms(time));
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: 'giveaway',
  description: 'Hosts a giveaway',
  usage: 'giveaway [time] [prize]',
  example: 'giveaway 1h Nitro'
};

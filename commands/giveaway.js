const ms = require('ms');
const { MessageEmbed } = require('discord.js');
exports.run = async (client, message, args) => {
  if (!args[0])
    return messages.channel.send(
      "Please enter a duration for the giveaway."
    );
  const time = args[0];
  const prize = message.content
    .split(" ")
    .slice(2)
    .join(" ");
  if (isNaN(ms(time)))
    return message.channel.send("The duration time is invalid.");
  if (ms(time) < 1)
    return message.channel.send("The duration time has to be atleast 1 second");
  if (prize === "") return message.channel.send("You have to enter a prize.");
  const embed = new MessageEmbed()
    .setTitle(`${prize}`)
    .setColor("36393F")
    .setDescription(
      `React with 🎉 to enter!\nTime duration: **${ms(time, { long: true })}**\nHosted by: ${message.author}`
    )
    .setTimestamp(Date.now() + ms(time))
    .setFooter("Ends at");
  const msg = await message.channel.send(":tada: **GIVEAWAY** :tada:", embed);
  await msg.react("🎉");
  setTimeout(() => {
    msg.reactions.cache.get("🎉").users.remove(client.user.id);
    setTimeout(() => {
      const winner = msg.reactions.cache.get("🎉").users.cache.random();
      if (msg.reactions.cache.get("🎉").users.cache.size < 1) {
        const winner_embed = new MessageEmbed()
          .setTitle(`${prize}`)
          .setColor("36393F")
          .setDescription(
            `Winner:\nNo one entered the giveaway.\nHosted by: ${message.author}`
          )
          .setTimestamp()
          .setFooter("Ended at");
        msg.edit(":tada: **GIVEAWAY ENDED** :tada:", winner_embed);
      }
      if (!msg.reactions.cache.get("🎉").users.cache.size < 1) {
        const winner_embed = new MessageEmbed()
          .setTitle(`${prize}`)
          .setColor("36393F")
          .setDescription(`Winner:\n${winner}\nHosted by: ${message.author}`)
          .setTimestamp()
          .setFooter("Ended at");
        msg.edit(":tada: **GIVEAWAY ENDED** :tada:", winner_embed);
      }
    }, 1000);
  }, ms(time));
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: "giveaway",
  description: "Hosts a giveaway",
  usage: "giveaway [time] [prize]"
};
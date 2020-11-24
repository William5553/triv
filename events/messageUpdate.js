const { MessageEmbed } = require("discord.js");
module.exports = (oldMessage, newMessage) => {
  if (!newMessage.content || !oldMessage.content || !newMessage.guild) return;
  const logs = newMessage.guild.channels.cache.find(
    channel => channel.name === "bot-logs"
  );
  if (newMessage.guild.me.hasPermission("MANAGE_CHANNELS") && !logs) {
    newMessage.guild.channels.create("bot-logs", { type: "text" });
  }

  const embed = new MessageEmbed()
    .setTitle("Message Edited")
    .setAuthor(
      `@${newMessage.author.tag} - #${newMessage.channel.name}`,
      newMessage.author.avatarURL()
    )
    .setFooter(`User ID: ${newMessage.author.id}`)
    .setTimestamp()
    .addField("**Old Message**", oldMessage.content, true)
    .addField("**New Message**", newMessage.content, true)
    .setColor("0xEB5234");
  if (logs) logs.send(embed);
};

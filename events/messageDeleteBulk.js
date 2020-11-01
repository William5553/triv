const { MessageEmbed } = require("discord.js");
module.exports = messages => {
const message = messages.first();
const length = messages.array().length;
  const channel = messages.first().channel.name;
  if (!message.guild) return;
  const logs = message.guild.channels.cache.find(channel => channel.name === "bot-logs");
  if (message.guild.me.hasPermission("MANAGE_CHANNELS") && !logs) {
    message.guild.channels.create("bot-logs", { type: "text" });
  }

const embed = new MessageEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL())
    .setColor(0xEB5234)
    .setTimestamp()
    .setDescription(`**Bulk Delete in #${channel}, ${length} messages deleted**`);
    if (logs) logs.send({embed});
  };

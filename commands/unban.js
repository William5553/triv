exports.run = (client, message, args) => {
  let reason = args.slice(1).join(" ");
  const user = args[0];
  const botlog = message.guild.channels.cache.find(
    channel => channel.name === "bot-logs"
  );
  if (message.guild.me.hasPermission("MANAGE_CHANNELS") && !botlog) {
    message.guild.channels.create("bot-logs", { type: "text" });
  } else if (!botlog) return message.reply("I cannot find a bot-logs channel");

  if (!user)
    return message
      .reply("You must supply a user ID.")
      .catch(client.logger.error);
  if (reason.length < 1)
    return message.reply("You must supply a reason for the unban.");
  message.guild.members
    .unban(user, { reason: reason })
    .catch(message.channel.send);
  const embed = new MessageEmbed()
    .setColor(0x00ae86)
    .setTimestamp()
    .setDescription(
      `**Action:** Unban\n**Target:** ${user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`
    );
  return message.guild.channels.cache
    .find(channel => channel.name === "bot-logs")
    .id.send({ embed });
  message.channel.send("unbanned");
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: "unban",
  description: "Unbans provided user.",
  usage: "unban [user id] [reason]"
};

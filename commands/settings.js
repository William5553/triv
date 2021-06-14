const { MessageEmbed } = require('discord.js');

exports.run = (client, message, args) => {
  if (args.length < 1) {
    const end = new MessageEmbed().setTitle(`**${message.guild.name}'s Settings**`);
    Object.keys(client.settings.get(message.guild.id)).forEach(key => end.addField(`**${key}**`, client.settings.get(message.guild.id)[key] || 'No value set'));
    return message.channel.send({ content: `To edit a value, run ${client.getPrefix(message)}${exports.help.name} [name] [value]`, embeds: [end] });
  }
  // Let's get our key and value from the arguments. 
  // This is array destructuring, by the way. 
  const [key, ...value] = args;
  // Example: 
  // key: "prefix"
  // value: ["+"]
  // (yes it's an array, we join it further down!)

  // We can check that the key exists to avoid having multiple useless, 
  // unused keys in the config:
  if (!client.settings.has(message.guild.id, key))
    return message.reply(`\`${key}\` is not in the config.`);

  // Now we can finally change the value. Here we only have strings for values 
  // so we won't bother trying to make sure it's the right type and such. 
  client.settings.set(message.guild.id, value.join(' '), key);

  message.channel.send(`${key} has been changed to: \`${value.join(' ')}\``);
};
  
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 3,
  cooldown: 1000
};
  
exports.help = {
  name: 'settings',
  description: 'Modify the bot settings',
  usage: 'settings',
  example: 'settings prefix !'
};
  
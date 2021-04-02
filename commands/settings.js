exports.run = (client, message, args) => {
  if (args.length < 1) {
    const end = [];
    Object.keys(client.settings.get(message.guild.id)).forEach(function(key) {
      end.push(`\`${key}\`: \`${client.settings.get(message.guild.id)[key] || ' '}\``);
    });
    return message.channel.send(`To edit a value, run ${client.getPrefix(message)}${exports.help.name} [name] [value]\n${end.join('\n')}`);
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

  // We can confirm everything's done to the client.
  message.channel.send(`${key} has been changed to: \`${value.join(' ')}\``);
};
  
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 3,
  cooldown: 500
};
  
exports.help = {
  name: 'settings',
  description: 'Modify the bot settings',
  usage: 'settings'
};
  
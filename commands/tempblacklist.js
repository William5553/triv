const ms = require('ms'),
  { MessageEmbed } = require('discord.js');

exports.run = (client, message, args) => {
  try {
    const user = message.mentions.users.first();
    let id;
    if (user && user.id)
      id = user.id;
    else if (!isNaN(args[0]))
      id = args[0];
    else
      return message.channel.send(`${client.settings.prefix}${exports.help.usage}`);
    const time = args.splice(1).join(' ');
    if (!time) return message.channel.send(`${client.settings.prefix}${exports.help.usage}`);
    if (isNaN(ms(time))) return message.channel.send('The duration time is invalid');
    if (ms(time) < 1) return message.channel.send('The duration time has to be atleast 1 second');
    if (ms(time) >= 2147483647) return message.reply('specified duration is too long');
    client.blacklist.push(id);
    message.channel.send(`Blacklisted user ${id} for ${ms(time)/1000} seconds`);
    setTimeout(() => {
      const index = client.blacklist.indexOf(id);
      if (index > -1) {
        client.blacklist.splice(index, 1);
      }
    }, ms(time));
  } catch (err) {
    return message.channel.send(new MessageEmbed()
      .setColor('RED')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`**Stack Trace:**\n\`\`\`${err.stack}\`\`\``)
      .addField('**Command:**', `${message.content}`)
    );
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['tb'],
  permLevel: 10
};

exports.help = {
  name: 'tempblacklist',
  description: 'Temporarily prevents a user from using the bot',
  usage: 'tempblacklist [user] [time]'
};

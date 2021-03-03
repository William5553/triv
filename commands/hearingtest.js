const path = require('path'),
  { Message, MessageEmbed } = require('discord.js'),
  { verify } = require('../util/Util'),  
  data = require('../assets/hearing-test.json');

exports.run = async (client, message) => {
  try {
    let age, range,
      previousAge = 'all',
      previousRange = 8;
    for (const { age: dataAge, khz, file } of data) {
      if (!message.guild.voice || !message.guild.voice.connection) {
        const connection = await client.commands.get('join').run(client, message);
        if (connection instanceof Message) return;
      } else if (message.member.voice.channelID !== message.guild.voice.channelID)
        return message.reply("I'm already in a voice channel");
      message.guild.voice.connection.dispatcher.setVolumeLogarithmic(1);
      message.guild.voice.connection.play(path.join(__dirname, '..', 'assets', 'hearingtest', file));
      await client.wait(3500);
      message.channel.send('Did you hear that sound? Reply with **[y]es** or **[n]o**.');
      const heard = await verify(message.channel, message.author);
      if (heard != true || file === data[data.length - 1].file) {
        age = previousAge;
        range = previousRange;
        break;
      }
      previousAge = dataAge;
      previousRange = khz;
    }
    message.member.voice.channel.leave();
    if (age === 'all')
      return message.channel.send('Everyone should be able to hear that. You cannot hear.');
    if (age === 'max') 
      return message.channel.send(`You can hear any frequency of which a human is capable. The maximum frequency you were able to hear was **${range}000hz**.`);
    return message.channel.send(`You have the hearing of someone **${Number.parseInt(age, 10) + 1} or older**. The maximum frequency you were able to hear was **${range}000hz**.`);
  } catch (err) {
    return message.channel.send(new MessageEmbed()
      .setColor('#FF0000')
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
  guildOnly: true,
  aliases: ['hearing', 'hear'],
  permLevel: 0
};

exports.help = {
  name: 'hearingtest',
  description: 'Tests your hearing',
  usage: 'hearingtest'
};

const path = require('path'),
  { MessageEmbed } = require('discord.js'),    
  data = require('../assets/hearing-test.json');

exports.run = async (client, msg) => {
  try {
    let age, range,
      previousAge = 'all',
      previousRange = 8;
    for (const { age: dataAge, khz, file } of data) {
      if (!msg.guild.voice || !msg.guild.voice.connection) 
        await client.commands.get('join').run(client, msg);
      else if (msg.member.voice.channelID !== msg.guild.voice.channelID)
        return msg.reply("I'm already in a voice channel");
      msg.guild.voice.connection.dispatcher.setVolumeLogarithmic(1);
      msg.guild.voice.connection.play(path.join(__dirname, '..', 'assets', 'hearingtest', file));
      await client.wait(3500);
      msg.channel.send('Did you hear that sound? Reply with **[y]es** or **[n]o**.');
      const heard = await client.verify(msg.channel, msg.author);
      if (heard != true || file === data[data.length - 1].file) {
        age = previousAge;
        range = previousRange;
        break;
      }
      previousAge = dataAge;
      previousRange = khz;
    }
    msg.member.voice.channel.leave();
    if (age === 'all')
      return msg.channel.send('Everyone should be able to hear that. You cannot hear.');
    if (age === 'max') 
      return msg.channel.send(`You can hear any frequency of which a human is capable. The maximum frequency you were able to hear was **${range}000hz**.`);
    return msg.channel.send(`You have the hearing of someone **${Number.parseInt(age, 10) + 1} or older**. The maximum frequency you were able to hear was **${range}000hz**.`);
  } catch (err) {
    return msg.channel.send(new MessageEmbed()
      .setColor('RED')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`**Stack Trace:**\n\`\`\`${err.stack}\`\`\``)
      .addField('**Command:**', `${msg.content}`)
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

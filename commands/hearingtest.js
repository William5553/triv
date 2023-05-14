const path = require('node:path');
const { Message, MessageEmbed } = require('discord.js');

const { getVoiceConnection, createAudioPlayer, createAudioResource, entersState, AudioPlayerStatus } = require('@discordjs/voice');
const { verify } = require('../util/Util');
const data = require('../assets/hearing-test.json');

exports.run = async (client, message) => {
  try {
    let age, range, connection, previousAge = 'all', previousRange = 8;
    if (!getVoiceConnection(message.guild.id)) {
      connection = await client.commands.get('join').run(client, message);
      if (connection instanceof Message) return;
    } else if (message.member.voice.channelId !== message.guild.me.voice.channelId)
      return message.reply("I'm already in a voice channel");
    if (!connection)
      connection = getVoiceConnection(message.guild.id);
    const player = createAudioPlayer();
    player.on('error', error => {
      client.logger.error(`An audio player encountered an error: ${error.stack ?? error}`);
      message.channel.send({embeds: [
        new MessageEmbed()
          .setColor('#FF0000')
          .setTimestamp()
          .setTitle('Please report this on GitHub')
          .setURL('https://github.com/william5553/triv/issues')
          .setDescription(`**The audio player encountered an error.\nStack Trace:**\n\`\`\`${error.stack ?? error}\`\`\``)
          .addFields({ name: '**Command:**', value: message.content })
      ]});
    });
    for (const { age: dataAge, khz, file } of data) {
      const resource = createAudioResource(path.join(process.cwd(), 'assets', 'hearingtest', file));
      player.play(resource);
      try {
        await entersState(player, AudioPlayerStatus.Playing, 5e3);
        connection.subscribe(player);
      } catch (error) {
        client.logger.error(`Error occurred while trying to play sound: ${error.stack ?? error}`);
        connection.destroy();
        player.stop(true);
        return message.reply(`An error occurred: ${error.message || error}`);
      }
      await client.wait(3500);
      message.channel.send('Did you hear that sound? Reply with **[y]es** or **[n]o**.');
      const heard = await verify(message.channel, message.author);
      if (heard != true || file === data.at(-1).file) {
        age = previousAge;
        range = previousRange;
        break;
      }
      previousAge = dataAge;
      previousRange = khz;
    }
    connection.destroy();
    player.stop(true);
    if (age === 'all')
      return message.channel.send('Everyone should be able to hear that. You cannot hear.');
    if (age === 'max') 
      return message.channel.send(`You can hear any frequency of which a human is capable. The maximum frequency you were able to hear was **${range}000hz**.`);
    return message.channel.send(`You have the hearing of someone **${Number.parseInt(age, 10) + 1} or older**. The maximum frequency you were able to hear was **${range}000hz**.`);
  } catch (error) {
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor('#FF0000')
        .setTimestamp()
        .setTitle('Please report this on GitHub')
        .setURL('https://github.com/william5553/triv/issues')
        .setDescription(`**Stack Trace:**\n\`\`\`${error.stack ?? error}\`\`\``)
        .addFields({ name: '**Command:**', value: message.content })
    ]});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['hearing', 'hear', 'heartest'],
  permLevel: 0,
  cooldown: 10_000
};

exports.help = {
  name: 'hearingtest',
  description: 'Tests your hearing',
  usage: 'hearingtest',
  example: 'hearingtest'
};

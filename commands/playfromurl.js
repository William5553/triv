const { Message, MessageEmbed } = require('discord.js');
const { createAudioPlayer, createAudioResource, getVoiceConnection, StreamType, AudioPlayerStatus } = require('@discordjs/voice');

exports.run = async (client, message, args) => {
  try {
    const queue = client.queue.get(message.guild.id);
    if (queue) return message.reply("there's currently music playing");
    if (args.length === 0) return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
    let connection;
    if (!getVoiceConnection(message.guild.id)) {
      connection = await client.commands.get('join').run(client, message);
      if (connection instanceof Message) return;
    } else if (message.member.voice.channelId !== message.guild.me.voice.channelId)
      return message.reply("I'm already in a voice channel");
    if (!connection)
      connection = getVoiceConnection(message.guild.id);
    const player = createAudioPlayer();
    player.on('error', error => {
      client.logger.error(`An audio player encountered an error: ${error.stack || error}`);
      message.channel.send({embeds: [
        new MessageEmbed()
          .setColor('#FF0000')
          .setTimestamp()
          .setTitle('Please report this on GitHub')
          .setURL('https://github.com/william5553/triv/issues')
          .setDescription(`**The audio player encountered an error.\nStack Trace:**\n\`\`\`${error.stack || error}\`\`\``)
          .addField('**Command:**', message.content)
      ]});
    });
    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
      player.stop();
    });
    const resource = createAudioResource(args.join(' '), { inputType: StreamType.Arbitrary });
    player.play(resource);
    connection.subscribe(player);
    if (message.channel.permissionsFor(client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY']))
      message.react('🔉');
  } catch (error) {
    if (message.channel.permissionsFor(client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY']))
      message.react('⚠️');
    return message.channel.send({embeds: [new MessageEmbed()
      .setColor('#FF0000')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`**Stack Trace:**\n\`\`\`${error.stack || error}\`\`\``)
      .addField('**Command:**', message.content)
    ]});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['playfromlink', 'purl'],
  permLevel: 10,
  cooldown: 10_000
};

exports.help = {
  name: 'playfromurl',
  description: 'Plays a sound file from a URL',
  usage: 'playfromurl [url]'
};

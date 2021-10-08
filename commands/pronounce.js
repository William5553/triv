const { Message, MessageEmbed, Permissions } = require('discord.js');
const { createAudioPlayer, createAudioResource, getVoiceConnection, StreamType, AudioPlayerStatus } = require('@discordjs/voice');
const { getCode } = require('../util/Util');

exports.run = async (client, message, args) => {
  try {
    const queue = client.queue.get(message.guild.id);
    if (queue) return message.reply("there's currently music playing");
    let connection;
    if (!getVoiceConnection(message.guild.id)) {
      connection = await client.commands.get('join').run(client, message);
      if (connection instanceof Message) return;
    } else if (message.member.voice.channelId !== message.guild.me.voice.channelId)
      return message.reply("I'm already in a voice channel");
      
    const text = args.slice(1).join(' ');
    const a1 = getCode(args[0].toProperCase());

    if (!getCode(a1)) return message.reply(`${args[0]} isn't a supported language`);

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
    const resource = createAudioResource(`http://translate.google.com/translate_tts?client=tw-ob&tl=${a1}&q=${text}`, { inputType: StreamType.Arbitrary });
    player.play(resource);
    connection.subscribe(player);
    if (message.channel.permissionsFor(client.user).has([Permissions.FLAGS.ADD_REACTIONS, Permissions.FLAGS.READ_MESSAGE_HISTORY]))
      message.react('🔉');
  } catch (error) {
    if (message.channel.permissionsFor(client.user).has([Permissions.FLAGS.ADD_REACTIONS, Permissions.FLAGS.READ_MESSAGE_HISTORY]))
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
  aliases: ['pron'],
  permLevel: 0,
  cooldown: 10_000
};

exports.help = {
  name: 'pronounce',
  description: 'Pronounces text using Google Translate',
  usage: 'pronounce [language] [text]',
  example: 'pronounce Spanish Hola'
};

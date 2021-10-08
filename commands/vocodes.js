const request = require('node-superfetch');
const { Readable } = require('node:stream');
const { MessageEmbed, Message, Permissions } = require('discord.js');
const { createAudioPlayer, createAudioResource, getVoiceConnection, StreamType, AudioPlayerStatus } = require('@discordjs/voice');
const voices = require('../assets/vocodes.json');

exports.run = async (client, message, args) => {
  const queue = client.queue.get(message.guild.id);
  if (queue) return message.reply("There's currently music playing");
  let connection, voice = args[0];
  const text = args.slice(1).join(' ');
  if (!voice || !Object.keys(voices).includes(voice.toLowerCase()))
    return message.channel.send(`Possible voices: ${Object.keys(voices).join(', ')}`);
  if (!text)
    return message.channel.send(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
  if (text.length > 500)
    return message.reply('Keep the message under 500 characters');
  voice = voices[voice.toLowerCase()];
  if (!getVoiceConnection(message.guild.id)) {
    connection = await client.commands.get('join').run(client, message);
    if (connection instanceof Message) return;
  } else if (message.member.voice.channelId !== message.guild.me.voice.channelId)
    return message.reply("I'm already in a voice channel");
  try {
    const { body } = await request
      .post('https://mumble.stream/speak_spectrogram')
      .send({
        speaker: voice,
        text
      });
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
    const resource = createAudioResource(Readable.from([Buffer.from(body.audio_base64, 'base64')]), { inputType: StreamType.Arbitrary });
    player.play(resource);
    connection.subscribe(player);
    if (message.channel.permissionsFor(client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY']))
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
  aliases: [],
  permLevel: 0,
  cooldown: 10_000
};

exports.help = {
  name: 'vocodes',
  description: 'Speak text like a variety of famous figures',
  usage: 'vocodes [voice] [text]',
  example: 'vocodes homer hey'
};

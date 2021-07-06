const request = require('node-superfetch');
const { Readable } = require('stream');
const { MessageEmbed, Message, Permissions } = require('discord.js');
const { createAudioPlayer, createAudioResource, getVoiceConnection, StreamType, AudioPlayerStatus } = require('@discordjs/voice');

exports.run = async (client, message, args) => {
  const queue = client.queue.get(message.guild.id);
  if (queue) return message.reply("There's currently music playing");
  const text = args.join(' ');
  if (!text)
    return message.channel.send(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
  if (text.length > 1024)
    return message.reply('Keep the message under 1024 characters man');
  let connection;
  if (!getVoiceConnection(message.guild.id)) {
    connection = await client.commands.get('join').run(client, message);
    if (connection instanceof Message) return;
  } else if (message.member.voice.channelID !== message.guild.me.voice.channelID)
    return message.reply("I'm already in a voice channel");
  try {
    const { body } = await request
      .get('http://tts.cyzon.us/tts')
      .query({ text });
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
    const resource = createAudioResource(Readable.from([body]), { inputType: StreamType.Arbitrary });
    player.play(resource);
    connection.subscribe(player);
    if (message.channel.permissionsFor(client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY']))
      message.react('🔉');
    return;
  } catch (err) {
    if (message.channel.permissionsFor(client.user).has([Permissions.FLAGS.ADD_REACTIONS, Permissions.FLAGS.READ_MESSAGE_HISTORY]))
      message.react('⚠️');
    return message.channel.send({embeds: [new MessageEmbed()
      .setColor('#FF0000')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`**Stack Trace:**\n\`\`\`${err.stack || err}\`\`\``)
      .addField('**Command:**', message.content)
    ]});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0,
  cooldown: 10000
};

exports.help = {
  name: 'tts',
  description: 'Text to speech.',
  usage: 'tts [text]',
  example: 'tts waffles'
};

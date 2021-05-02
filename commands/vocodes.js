const request = require('node-superfetch');
const { Readable } = require('stream');
const { MessageEmbed, Message } = require('discord.js');
const voices = require('../assets/vocodes.json');

exports.run = async (client, message, args) => {
  const queue = client.queue.get(message.guild.id);
  if (queue) return message.reply("there's currently music playing");
  let voice = args[0];
  const text = args.slice(1).join(' ');
  if (!voice || !Object.keys(voices).includes(voice.toLowerCase()))
    return message.channel.send(`Possible voices: ${Object.keys(voices).join(', ')}`);
  if (!text)
    return message.channel.send(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
  if (text.length > 500)
    return message.reply('keep the message under 500 characters man');
  voice = voices[voice.toLowerCase()];
  if (!message.guild.voice || !message.guild.voice.connection) {
    const connection = await client.commands.get('join').run(client, message);
    if (connection instanceof Message) return;
  } else if (message.member.voice.channelID !== message.guild.voice.channelID)
    return message.reply("I'm already in a voice channel");
  try {
    const { body } = await request
      .post('https://mumble.stream/speak_spectrogram')
      .send({
        speaker: voice,
        text
      });
    message.guild.voice.connection
      .play(Readable.from([Buffer.from(body.audio_base64, 'base64')]))
      .on('finish', () => message.member.voice.channel.leave())
      .on('error', err => client.logger.error(err));
    if (message.channel.permissionsFor(client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY']))
      message.react('🔉');
    return null;
  } catch (err) {
    if (message.channel.permissionsFor(client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY']))
      message.react('⚠️');
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
  aliases: [],
  permLevel: 0,
  cooldown: 10000
};

exports.help = {
  name: 'vocodes',
  description: 'Speak text like a variety of famous figures',
  usage: 'vocodes [voice] [text]',
  example: 'vocodes homer hey'
};

const request = require('node-superfetch'),
  { Readable } = require('stream'),
  { MessageEmbed, Message } = require('discord.js'),
  voices = require('../assets/vocodes.json');

exports.run = async (client, msg, args) => {
  const queue = client.queue.get(msg.guild.id);
  if (queue) return msg.reply("there's currently music playing");
  let voice = args[0];
  const text = args.splice(1).join(' ');
  if (!voice || !Object.keys(voices).includes(voice.toLowerCase()))
    return msg.channel.send(`Possible voices: ${Object.keys(voices).join(', ')}`);
  if (!text)
    return msg.channel.send(`Usage: ${client.settings.prefix}${exports.help.usage}`);
  if (text.length > 500)
    return msg.reply('keep the message under 500 characters man');
  voice = voices[voice.toLowerCase()];
  if (!msg.guild.voice || !msg.guild.voice.connection) {
    const connection = await client.commands.get('join').run(client, msg);
    if (connection instanceof Message) return;
  } else if (msg.member.voice.channelID !== msg.guild.voice.channelID)
    return msg.reply("I'm already in a voice channel");
  try {
    const { body } = await request
      .post('https://mumble.stream/speak_spectrogram')
      .send({
        speaker: voice,
        text
      });
    msg.guild.voice.connection
      .play(Readable.from([Buffer.from(body.audio_base64, 'base64')]))
      .on('finish', () => msg.member.voice.channel.leave())
      .on('error', err => client.logger.error(err));
    if (msg.channel.permissionsFor(client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY']))
      msg.react('🔉');
    return null;
  } catch (err) {
    if (msg.channel.permissionsFor(client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY']))
      msg.react('⚠️');
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
  aliases: [],
  permLevel: 0,
  cooldown: 10000
};

exports.help = {
  name: 'vocodes',
  description: 'Speak text like a variety of famous figures',
  usage: 'vocodes [voice] [text]'
};

const request = require('node-superfetch'),
  { Readable } = require('stream'),
  voices = require('../assets/vocodes.json');

exports.run = async (client, msg, args) => {
  let voice = args[0].toLowerCase();
  const text = args.splice(1).join(' ');
  if (!voice || !Object.keys(voices).includes(voice))
    return msg.channel.send(`Possible voices: ${Object.keys(voices).join(', ')}`);
  if (!text)
    return msg.channel.send(`Usage: ${client.settings.prefix}${exports.help.usage}`);
  if (text.length > 500)
    return msg.reply('keep the message under 500 characters man');
  voice = voices[voice.toLowerCase()];
  if (!msg.guild.voice || !msg.guild.voice.connection) 
    await client.commands.get('join').run(client, msg);
  else if (msg.member.voice.channelID !== msg.guild.voice.channelID)
    return msg.reply("I'm already in a voice channel");
  try {
    if (msg.channel.permissionsFor(client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY']))
      msg.react('💬');
    const { body } = await request
      .post('https://mumble.stream/speak_spectrogram')
      .send({
        speaker: voice,
        text
      });
    msg.guild.voice.connection.play(Readable.from([Buffer.from(body.audio_base64, 'base64')]));
    if (msg.channel.permissionsFor(client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY']))
      msg.react('🔉');
    return null;
  } catch (err) {
    if (msg.channel.permissionsFor(client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY']))
      msg.react('⚠️');
    return msg.reply(`uh oh, an error occurred: \`${err.message}\`. Try again later!`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'vocodes',
  description: 'Speak text like a variety of famous figures',
  usage: 'vocodes [voice] [text]'
};

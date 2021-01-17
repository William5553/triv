const request = require('node-superfetch'),
  { Readable } = require('stream'),
  { MessageEmbed } = require('discord.js');

exports.run = async (client, msg, args) => {
  const text = args.join(' ');
  if (!text)
    return msg.channel.send(`Usage: ${client.settings.prefix}${exports.help.usage}`);
  if (text.length > 1024)
    return msg.reply('keep the message under 1024 characters man');
  if (!msg.guild.voice || !msg.guild.voice.connection) 
    await client.commands.get('join').run(client, msg);
  else if (msg.member.voice.channelID !== msg.guild.voice.channelID)
    return msg.reply("I'm already in a voice channel");
  try {
    const { body } = await request
      .get('http://tts.cyzon.us/tts')
      .query({ text });
    msg.guild.voice.connection
      .play(Readable.from([body]))
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
  permLevel: 0
};

exports.help = {
  name: 'tts',
  description: "The world's best text-to-speech",
  usage: 'tts [text]'
};

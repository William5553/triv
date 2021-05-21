const { Message, MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
  try {
    const queue = client.queue.get(message.guild.id);
    if (queue) return message.reply("there's currently music playing");
    if (message.attachments.size < 1) return message.reply(`usage: ${client.getPrefix(message)}${exports.help.usage}`);
    if (!message.guild.voice || !message.guild.voice.connection) {
      const connection = await client.commands.get('join').run(client, message);
      if (connection instanceof Message) return;
    } else if (message.member.voice.channelID !== message.guild.voice.channelID)
      return message.reply("I'm already in a voice channel");

    const attachment = message.attachments.first();

    message.guild.voice.connection
      .play(attachment.url)
      .on('finish', () => message.member.voice.channel.leave())
      .on('error', err => client.logger.error(err));
    if (message.channel.permissionsFor(client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY']))
      message.react('🔉');
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
  aliases: ['pfile', 'pattachment'],
  permLevel: 10,
  cooldown: 10000
};

exports.help = {
  name: 'playfromfile',
  description: 'Plays a sound file from an attachment',
  usage: 'playfromfile [file]'
};

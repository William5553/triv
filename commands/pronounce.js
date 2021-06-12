const { Message, MessageEmbed } = require('discord.js');
const { getCode } = require('../util/Util');

exports.run = async (client, message, args) => {
  try {
    const queue = client.queue.get(message.guild.id);
    if (queue) return message.reply("there's currently music playing");
    if (!message.guild.me.voice || !message.guild.me.voice.connection) {
      const connection = await client.commands.get('join').run(client, message);
      if (connection instanceof Message) return;
    } else if (message.member.voice.channelID !== message.guild.me.voice.channelID)
      return message.reply("I'm already in a voice channel");
    const text = args.slice(1).join(' ');

    const a1 = getCode(args[0].toProperCase());

    if (!getCode(a1)) return message.reply(`${args[0]} isn't a supported language`);

    message.guild.me.voice.connection
      .play(`http://translate.google.com/translate_tts?client=tw-ob&tl=${a1}&q=${text}`)
      .on('finish', () => message.member.voice.channel.leave())
      .on('error', err => client.logger.error(err));
    if (message.channel.permissionsFor(client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY']))
      message.react('🔉');
  } catch (err) {
    if (message.channel.permissionsFor(client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY']))
      message.react('⚠️');
    return message.channel.send({embeds: [new MessageEmbed()
      .setColor('#FF0000')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`**Stack Trace:**\n\`\`\`${err.stack || err}\`\`\``)
      .addField('**Command:**', `${message.content}`)
    ]});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['pron'],
  permLevel: 0,
  cooldown: 10000
};

exports.help = {
  name: 'pronounce',
  description: 'Pronounces text using Google Translate',
  usage: 'pronounce [language] [text]',
  example: 'pronounce Spanish Hola'
};

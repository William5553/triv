const path = require('path');
const { Message, Permissions } = require('discord.js');
const fs = require('fs');
const { getVoiceConnection } = require('@discordjs/voice');
const airhorn = fs.readdirSync(path.join(process.cwd(), 'assets', 'airhorn'));

exports.run = async (client, message) => {
  const queue = client.queue.get(message.guild.id);
  if (queue) return message.reply("there's currently music playing");
  if (!getVoiceConnection(message.guild.id)) {
    const connection = await client.commands.get('join').run(client, message);
    if (connection instanceof Message) return;
  } else if (message.member.voice.channelID !== message.guild.me.voice.channelID)
    return message.reply("I'm already in a voice channel");
  message.guild.me.voice.connection
    .play(path.join(process.cwd(), 'assets', 'airhorn', airhorn.random()))
    .on('finish', () => message.member.voice.channel.leave())
    .on('error', err => client.logger.error(err));
  if (message.channel.permissionsFor(client.user).has([Permissions.FLAGS.ADD_REACTIONS, Permissions.FLAGS.READ_MESSAGE_HISTORY]))
    await message.react('🔉');
};
    
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['ah'],
  permLevel: 0,
  cooldown: 3000
};

exports.help = {
  name: 'airhorn',
  description: 'Plays an airhorn sound',
  usage: 'airhorn',
  example: 'airhorn'
};

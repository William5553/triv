const path = require('path');
const { Message, MessageEmbed, Permissions } = require('discord.js');
const fs = require('fs');
const { getVoiceConnection, createAudioPlayer, createAudioResource, entersState, AudioPlayerStatus } = require('@discordjs/voice');
const airhorn = fs.readdirSync(path.join(process.cwd(), 'assets', 'airhorn'));

exports.run = async (client, message) => {
  const queue = client.queue.get(message.guild.id);
  if (queue) return message.reply("There's currently music playing");
  let connection;
  if (!getVoiceConnection(message.guild.id)) {
    connection = await client.commands.get('join').run(client, message);
    if (connection instanceof Message) return;
  } else if (message.member.voice.channelID !== message.guild.me.voice.channelID)
    return message.reply("I'm already in a voice channel");
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
        .addField('**Command:**', `${message.content}`)
    ]});
  });
  player.on(AudioPlayerStatus.Idle, () => {
    getVoiceConnection(message.guild.id).destroy();
    player.stop();
  });
  const resource = createAudioResource(path.join(process.cwd(), 'assets', 'airhorn', airhorn.random()));
  player.play(resource);
  try {
    await entersState(player, AudioPlayerStatus.Playing, 5e3);
    getVoiceConnection(message.guild.id).subscribe(player);
  } catch (error) {
    message.reply(`An error occurred: ${error.message || error}`);
    client.logger.error(`Error occurred while trying to airhorn: ${error.stack || error}`);
  }
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

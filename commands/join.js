const { Permissions } = require('discord.js');
const { joinVoiceChannel, entersState, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');

exports.run = async (client, message, args) => {
  if (!getVoiceConnection(message.guild.id)) {
    const vc = message.member.voice.channel || (!isNaN(args[0]) ? await message.guild.channels.resolve(args[0]) : null);

    if (vc) {
      if (!vc.joinable) return message.channel.send('I cannot join the vc, check my permissions.');
      const permissions = vc.permissionsFor(client.user);
      if (!permissions.has(Permissions.FLAGS.CONNECT))
        return message.reply('cannot connect to voice channel, missing the **CONNECT** permission');
      if (!permissions.has(Permissions.FLAGS.SPEAK))
        return message.reply('I cannot speak in this voice channel, make sure I have the **SPEAK** permission!');
      const connection = joinVoiceChannel({
        channelId: vc.id,
        guildId: vc.guild.id,
        selfDeaf: true,
        adapterCreator: vc.guild.voiceAdapterCreator
      });
      try {
        // if we're not ready in the vc in 25 sec, error
        await entersState(connection, VoiceConnectionStatus.Ready, 25e3);
        connection.on(VoiceConnectionStatus.Disconnected, async () => {
          try {
            await Promise.race([
              entersState(connection, VoiceConnectionStatus.Signalling, 5e3),
              entersState(connection, VoiceConnectionStatus.Connecting, 5e3)
            ]);
            // Seems to be reconnecting to a new channel - ignore disconnect
          } catch (error) {
            // Seems to be a real disconnect which SHOULDN'T be recovered from
            connection.destroy();
          }
        });
        return connection;
      } catch (error) {
        connection.destroy();
        message.reply(`Failed to connect to ${vc.name}: ${error.message || error}`);
        client.logger.error(`Failed to connect to ${vc.name} in ${vc.guild.name}: ${error.stack || error}`);
      }
    } else return message.reply('you have to be in a voice channel moron');
  } else if (message.member.voice.channelID !== message.guild.me.voice.channelID)
    return message.reply("I'm already in a voice channel");
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'join',
  description: 'Joins the voice channel',
  usage: 'join [channel id]'
};

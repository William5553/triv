const path = require('path'),
  fs = require('fs'),
  airhorn = fs.readdirSync(path.join(process.cwd(), 'assets', 'airhorn')).random();

exports.run = async (client, msg) => {
  if (!msg.guild.voice || !msg.guild.voice.connection) 
    await client.commands.get('join').run(client, msg);
  else if (msg.member.voice.channelID !== msg.guild.voice.channelID)
    return msg.reply("I'm already in a voice channel");
  msg.guild.voice.connection
    .play(path.join(process.cwd(), 'assets', 'airhorn', airhorn))
    .on('finish', () => {
      msg.member.voice.channel.leave();
    })
    .on('error', err => client.logger.error(err));
  if (msg.channel.permissionsFor(client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'])) {
    await msg.react('🔉');
  }
};
    
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'airhorn',
  description: 'Plays an airhorn sound',
  usage: 'airhorn'
};

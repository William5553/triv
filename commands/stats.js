const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

exports.run = (client, message) => {
  const duration = moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
  message.channel.send(
    `= STATISTICS =
• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Uptime     :: ${duration}
• Users      :: ${client.users.cache.size.toLocaleString()}
• Servers    :: ${client.guilds.cache.size.toLocaleString()}
• Channels   :: ${client.channels.cache.size.toLocaleString()}
• Discord.js :: v${Discord.version}
• Node       :: ${process.version}`,
    { code: 'asciidoc' },
  );
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
};

exports.help = {
  name: 'stats',
  description: 'Gives some useful bot statistics',
  usage: 'stats',
};

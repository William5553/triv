const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

exports.run = (client, message) => {
  const duration = moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
  message.channel.send(`= STATISTICS =
• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Uptime     :: ${duration}
• Users      :: ${client.users.size.toLocaleString()}
• Servers    :: ${client.guilds.size.toLocaleString()}
• Channels   :: ${client.channels.size.toLocaleString()}
• Discord.js :: v${Discord.version}
• Node       :: ${process.version}`, {code: 'asciidoc'});

  const bicon = client.user.displayAvatarURL();
  const botembed = new Discord.MessageEmbed()
    .setDescription('Bot Information')
    .setColor('#15f153')
    .setThumbnail(bicon)
    .addField('Bot Name', client.user.username)
    .addField('Created On', client.user.createdAt);

  message.channel.send(botembed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'stats',
  description: 'Gives some useful bot statistics',
  usage: 'stats'
};

const { version, MessageEmbed } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

exports.run = (client, message) => 
  message.channel.send({embeds: [new MessageEmbed()
    .setTitle('= **STATISTICS** =')
    .addField('Triv Version', require('../package.json').version)
    .addField('Memory Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`)
    .addField('Uptime', moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]'))
    .addField('Commands', client.commands.size.toLocaleString())
    .addField('Aliases', client.aliases.size.toLocaleString())
    .addField('Users', client.users.cache.size.toLocaleString())
    .addField('Guilds', client.guilds.cache.size.toLocaleString())
    .addField('Channels', client.channels.cache.size.toLocaleString())
    .addField('Discord.js', `v${version}`)
    .addField('Node.js', process.version)
  ]});

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  cooldown: 2500
};

exports.help = {
  name: 'stats',
  description: 'Gives some useful bot statistics',
  usage: 'stats',
  example: 'stats'
};

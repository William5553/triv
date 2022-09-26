const { version, MessageEmbed } = require('discord.js');
const process = require('node:process');
const moment = require('moment');
require('moment-duration-format');

exports.run = (client, message) => 
  message.channel.send({embeds: [
    new MessageEmbed()
      .setTitle('= **STATISTICS** =')
      .addFields([
        { name: 'Triv Version', value: require('../package.json').version },
        { name: 'Memory Usage', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB` },
        { name: 'Uptime', value: moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]') },
        { name: 'Commands', value: client.commands.size.toLocaleString() },
        { name: 'Aliases', value: client.aliases.size.toLocaleString() },
        { name: 'Users', value: client.users.cache.size.toLocaleString() },
        { name: 'Guilds', value: client.guilds.cache.size.toLocaleString() },
        { name: 'Channels', value: client.channels.cache.size.toLocaleString() },
        { name: 'Discord.js', value: `v${version}` },
        { name: 'Node.js', value: process.version }
      ])
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

const { Client, Collection, MessageEmbed } = require('discord.js');
const client = new Client({ disableMentions: 'everyone' });
const fs = require('fs');
const settings = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));

require('./util/eventLoader')(client);
client.logger = require('./util/logger');
require('./util/functions')(client);

client.queue = new Map();

client.commands = new Collection();
client.aliases = new Collection();
fs.readdir('./commands/', (err, files) => {
  if (err) client.logger.error(err);
  client.logger.log(`Loading a total of ${files.length} commands.`);
  files.forEach(f => {
    client.load(f);
  });
});

client.on('warn', client.logger.warn);
client.on('error', client.logger.error);
client.on('message', message => {
const xp = require('../xp.json');
    const xpAdd = Math.floor(Math.random() * 7) + 8;

    if (!xp[message.guild.id]) {
      xp[message.guild.id] = {
        '-1': {
          level: -1,
          xp: -1,
          messagessent: -1,
        },
      };
    }
    if (!xp[message.guild.id][message.author.id]) {
      xp[message.guild.id][message.author.id] = {
        level: 1,
        xp: 0,
        messagessent: 0,
      };
    }

    const messagessent = xp[message.guild.id][message.author.id].messagessent;
    const curxp = xp[message.guild.id][message.author.id].xp;
    const curlvl = xp[message.guild.id][message.author.id].level;
    const nxtLvl = xp[message.guild.id][message.author.id].level * 200;
    xp[message.guild.id][message.author.id].xp = curxp + xpAdd;
    xp[message.guild.id][message.author.id].messagessent = messagessent + Number(1);
    if (nxtLvl <= xp[message.guild.id][message.author.id].xp) {
      xp[message.guild.id][message.author.id].level = curlvl + 1;
      const lvlup = new MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .setTitle('Level Up!')
        .setColor(0x902b93)
        .addField('New Level', curlvl + 1);

      message.channel.send(lvlup);
    }
    fs.writeFile('../xp.json', JSON.stringify(xp), err => {
      if (err) client.logger.error(err);
    });
})

client.login(settings.token);

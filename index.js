const { Client, Collection, MessageEmbed } = require('discord.js');
const client = new Client({ disableMentions: 'everyone' });
const fs = require('fs');
const settings = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));

client.logger = require('./util/logger');
require('./util/eventLoader')(client);
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
client.on('message', async message => {
  if (!message.guild || message.author.bot) return;
  
  const xp = JSON.parse(fs.readFileSync('./xp.json', 'utf-8'));

  if (!xp[message.guild.id]) {
      xp[message.guild.id] = {}
    };
  }
  
  if (!xp[message.guild.id][message.author.id]) {
    xp[message.guild.id][message.author.id] = {
      lvl: 1,
      xp: 0,
      ms: 0
    };
  }
  
  xp[message.guild.id][message.author.id].xp = xp[message.guild.id][message.author.id].xp + Math.floor(Math.random() * 7) + 8;
  xp[message.guild.id][message.author.id].ms = xp[message.guild.id][message.author.id].ms + Number(1);
  if (xp[message.guild.id][message.author.id].lvl*200 <= xp[message.guild.id][message.author.id].xp) {
    xp[message.guild.id][message.author.id].lvl = xp[message.guild.id][message.author.id].lvl + 1;
    const lvlup = new MessageEmbed()
      .setAuthor(message.author.username, message.author.avatarURL())
      .setTitle('Level Up!')
      .setColor(0x902b93)
      .addField('New Level', xp[message.guild.id][message.author.id].lvl + 1);

    message.channel.send(lvlup);
  }
  fs.writeFile('./xp.json', JSON.stringify(xp), err => {
    if (err) client.logger.error(err);
  });
});

if (settings && settings.token)
  try {
    client.login(settings.token);
  } catch (e) {
    client.logger.error(e);
  }
else
  client.logger.error('please input a token in settings.json');

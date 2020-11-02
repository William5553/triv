const { Client, Collection, MessageEmbed } = require('discord.js');
const client = new Client({ disableMentions: 'everyone' });
const fs = require('fs');
const settings = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));

require('./util/eventLoader')(client);
client.logger = require('./util/Logger');
require('./util/functions')(client);

client.queue = new Map();

client.commands = new Collection();
client.aliases = new Collection();
fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);
  client.logger.log(`Loading a total of ${files.length} commands.`);
  files.forEach(f => {
    const props = require(`./commands/${f}`);
    client.logger.log(`Loading Command: ${props.help.name}. 👌`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.on("warn", (info) => console.log(info));
client.on("error", console.error);
client.on('message', async message => {
  // levelling system
  if (!message.guild || message.author.bot) return;

  const xp = require('./xp.json');
  const xpAdd = Math.floor(Math.random() * 7) + 8;

  if (!xp[message.guild.id]) {
    xp[message.guild.id] = {
      "0": {
        "level": 1,
        "xp": 0,
        "messagessent": 0
      }
    };
  }
  if (!xp[message.guild.id][message.author.id]) {
    xp[message.guild.id][message.author.id] = {
      xp: 0,
      level: 1,
      messagessent: 0
    };
  }

  const messagessent = xp[message.guild.id][message.author.id].messagessent;
  const curxp = xp[message.guild.id][message.author.id].xp;
  const curlvl = xp[message.guild.id][message.author.id].level;
  const nxtLvl = xp[message.guild.id][message.author.id].level * 200;
  xp[message.guild.id][message.author.id].xp =  curxp + xpAdd;
  xp[message.guild.id][message.author.id].messagessent = messagessent + Number(1);
  if (nxtLvl <= xp[message.guild.id][message.author.id].xp) {
    xp[message.guild.id][message.author.id].level = curlvl + 1;
    const lvlup = new MessageEmbed()
      .setAuthor(message.author.username, message.author.avatarURL())
      .setTitle('Level Up!')
      .setColor(0x902B93)
      .addField('New Level', curlvl + 1);

    message.channel.send(lvlup);
  }
  fs.writeFile('./xp.json', JSON.stringify(xp), (err) => {
    if (err) console.log(err);
  });
});

client.elevation = message => {
  /* This function should resolve to an ELEVATION level which
     is then sent to the command handler for verification*/
  let permlvl = 0;
  if (message.member.permissions.has("MANAGE_MESSAGES")) permlvl = 2;
  if (message.member.permissions.has("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === settings.ownerid) permlvl = 4;
  return permlvl;
};

client.login(settings.token);

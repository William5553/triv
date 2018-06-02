const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });
const fs = require('fs');
const request = require('request'); // eslint-disable-line no-unused-vars
const settings = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));
const prefix = settings.prefix;
const xp = require('./storage/xp.json');

require('./util/eventLoader')(client);

client.logger = require('./util/Logger');

require('./util/functions.js')(client);

const Music = require('discord.js-musicbot-addon');
const music = new Music(client, {  // eslint-disable-line no-unused-vars
  youtubeKey: settings.yt_api_key,
  botPrefix: prefix,
  global: false,
  maxQueueSize: 16,
  anyoneCanSkip: true,
  clearInvoker: false,
  messageHelp: true,
  botAdmins: settings.ownerid,
  requesterName: true,
  streamMode: 0,
  helpCmd: 'help',
  botOwner: settings.ownerid,
  disabledLoop: true,
  leaveCmd: 'leave',
  enableQueueStat: true
});


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
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


client.elevation = message => {
  /* This function should resolve to an ELEVATION level which
     is then sent to the command handler for verification*/
  let permlvl = 0;
  const mod_role = message.guild.roles.find('name', settings.modrolename);
  if (mod_role && message.member.roles.has(mod_role.id)) permlvl = 2;
  const admin_role = message.guild.roles.find('name', settings.adminrolename);
  if (admin_role && message.member.roles.has(admin_role.id)) permlvl = 3;
  if (message.author.id === settings.ownerid) permlvl = 4;
  return permlvl;
};


client.on('message', async message => {


  // levelling system
  if (message.author.id == settings.bot_client_id) return;

  const xpAdd = Math.floor(Math.random() * 7) + 8;

  if (!xp[message.author.id]) {
    xp[message.author.id] = {
      xp: 0,
      level: 1,
    };
  }

  const curxp = xp[message.author.id].xp;
  const curlvl = xp[message.author.id].level;
  const nxtLvl = xp[message.author.id].level * 250;
  xp[message.author.id].xp =  curxp + xpAdd;
  if (nxtLvl <= xp[message.author.id].xp) {
    xp[message.author.id].level = curlvl + 1;
    const lvlupnum = curlvl + Number(1);
    const lvlup = new Discord.RichEmbed()
      .setTitle('Level up!')
      .setColor(0x00AE86)
      .setDescription(lvlupnum)
      .setFooter(message.author.username, message.author.displayAvatarURL)
      .setTimestamp();

    message.channel.send(lvlup);
  }
  fs.writeFile('./storage/xp.json', JSON.stringify(xp), (err) => {
    if (err) message.channel.send(err);
  });
});

client.login(settings.token);

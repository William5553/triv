const Discord = require('discord.js');
const client = new Discord.Client({ disableMentions: 'everyone' });
const fs = require('fs');
const request = require('request'); // eslint-disable-line no-unused-vars
const settings = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));
const xp = require('./storage/xp.json');

require('./util/eventLoader')(client);

client.logger = require('./util/Logger');

require('./util/functions.js')(client);

const Music = require('discord.js-musicbot-addon');
const music = Music.start(client, {  // eslint-disable-line no-unused-vars
  youtubeKey: settings.yt_api_key,
  botPrefix: settings.prefix,
  global: false,
  maxQueueSize: 50,
  anyoneCanSkip: true,
  messageHelp: true,
  ownerID: settings.ownerid,
  ownerOverMember: true,
  musicPresence: true
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
  if (message.member.permissions.has("MANAGE_MESSAGES")) permlvl = 2;
  if (message.member.permissions.has("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === settings.ownerid) permlvl = 4;
  return permlvl;
};


client.on('message', async message => {
  // levelling system
  if (message.author.id === client.user.id || message.author.bot) return;

  const xpAdd = Math.floor(Math.random() * 7) + 8;

  if (!xp[message.author.id]) {
    xp[message.author.id] = {
      xp: 0,
      level: 1,
      messagesent: 0
    };
  }

  const messagesent = xp[message.author.id].messagesent;
  const curxp = xp[message.author.id].xp;
  const curlvl = xp[message.author.id].level;
  const nxtLvl = xp[message.author.id].level * 250;
  xp[message.author.id].xp =  curxp + xpAdd;
  xp[message.author.id].messagesent = messagesent + Number(1);
  if (nxtLvl <= xp[message.author.id].xp) {
    xp[message.author.id].level = curlvl + 1;
    const lvlup = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.avatarURL)
      .setTitle('Level Up!')
      .setColor(0x902B93)
      .addField('New Level', curlvl + 1);

    message.channel.send(lvlup);
  }
  fs.writeFile('./xp.json', JSON.stringify(xp), (err) => {
    if (err) console.log(err);
  });
});

client.on('messageDelete', message => {
  if (message.channel.type === 'text') {
    var logger = message.guild.channels.find(
      channel => channel.name === 'bot-logs'
    );
    if (logger) {
      const msgDel = new Discord.MessageEmbed()
        .setTitle('Message Deleted')
        .addField('Author', message.author.username)
        .addField('Message', message.cleanContent)
        .setThumbnail(message.author.avatarURL())
        .setColor('0x00AAFF');
      logger.send({ msgDel });
    }
  }
});

client.login(settings.token);

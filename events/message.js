const Discord = require ('discord.js');
const fs = require('fs');
const settings = require('../settings.json');
const xp = require('../storage/xp.json');
module.exports = message => {
  const client = message.client;
  if (message.author.id === client.user.id || message.author.bot || message.channel.type !== 'text') return;
  const xpAdd = Math.floor(Math.random() * 7) + 8;

  if (!xp[message.author.id]) {
    xp[message.author.id] = {
      xp: 0,
      level: 1,
      messagessent: 0
    };
  }

  const messagessent = xp[message.author.id].messagessent;
  const curxp = xp[message.author.id].xp;
  const curlvl = xp[message.author.id].level;
  const nxtLvl = xp[message.author.id].level * 250;
  xp[message.author.id].xp =  curxp + xpAdd;
  xp[message.author.id].messagessent = messagessent + Number(1);
  if (nxtLvl <= xp[message.author.id].xp) {
    xp[message.author.id].level = curlvl + 1;
    const lvlup = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.avatarURL)
      .setTitle('Level Up!')
      .setColor(0x902B93)
      .addField('New Level', curlvl + 1);

    message.channel.send(lvlup);
  }
  fs.writeFile('../storage/xp.json', JSON.stringify(xp), (err) => {
    if (err) console.log(err);
  });
  
  if (!message.content.startsWith(settings.prefix)) return;
  const command = message.content.split(' ')[0].slice(settings.prefix.length);
  const params = message.content.split(' ').slice(1);
  const perms = client.elevation(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms);
  }

};

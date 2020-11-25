const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const settings = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));
module.exports = message => {
  const { client } = message;
  if (message.author.bot) return;
  if (message.guild) {
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
  }
  if (!message.content.startsWith(settings.prefix)) return;
  const command = message.content.split(' ')[0].slice(settings.prefix.length).toLowerCase();
  const params = message.content.split(' ').slice(1);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (!message.guild) {
      if (cmd.conf.guildOnly === false) {
        if (cmd.conf.permLevel === 4 && message.author.id !== settings.ownerid) return message.reply("you don't have the perms for that");
        return cmd.run(client, message, params, 3);
      }
      else if (cmd.conf.guildOnly === true)
        return message.reply('that command can only be used in a guild, get some friends.');
      else
        return client.logger.warn(`${cmd.help.name}'s guildOnly should be a boolean but it is ${cmd.conf.guildOnly}`);
    }
    const perms = client.elevation(message);
    if (perms < cmd.conf.permLevel) return message.reply("you don't have the perms for that");
    cmd.run(client, message, params, perms);
  }
};

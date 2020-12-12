const moment = require('moment'),
  fetch = require('node-superfetch'),
  { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  if (!args[0]) return message.reply('tell me a Minecraft username next time, idiot');
  const name = args[0];
  let findPlayer;
  
  try {
    findPlayer = await nameToUUID(name, message) || await uuidToName(name, message);
  } catch (e) {
    return message.channel.send('User not found');
  }
  
  if (findPlayer.uuid) {
    message.channel.send(
      new MessageEmbed()
        .setImage(`https://visage.surgeplay.com/full/512/${findPlayer.uuid}.png`)
        .setTitle('NameMC profile (click here)')
        .setURL(`https://namemc.com/profile/${findPlayer.uuid}`)
        .setAuthor(`${findPlayer.name}'s skin`, `https://visage.surgeplay.com/head/512/${findPlayer.uuid}.png`)
    );
  } else {
    message.channel.send('User not found');
  }
};

async function nameToUUID(name) {
  const { body } = await fetch.get(`https://api.mojang.com/users/profiles/minecraft/${name}?at=${moment().format('x')}`);
  if (body.id) return { uuid: body.id, name: body.name };
  return false;
}

async function uuidToName(uuid) {
  const { body } = await fetch.get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
  if (body.id) return { uuid: body.id, name: body.name };
  return false;
}
  
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'mcskin',
  description: "Retrieves a user's Minecraft skin",
  usage: 'mcskin [minecraft username]'
};

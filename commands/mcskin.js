const fetch = require('node-superfetch');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  if (!args[0]) return message.reply('Tell me a Minecraft username next time, idiot');
  let findPlayer;
  
  try {
    findPlayer = await nameToUUID(args[0]) || await uuidToName(args[0]);
  } catch (e) {
    return message.channel.send(`User not found: ${e.stack || e}`);
  }
  
  if (findPlayer.uuid) {
    message.channel.send({embeds: [new MessageEmbed()
      .setImage(`https://visage.surgeplay.com/full/512/${findPlayer.uuid}.png`)
      .setTitle('NameMC profile (click here)')
      .setURL(`https://namemc.com/profile/${findPlayer.uuid}`)
      .setAuthor(`${findPlayer.name}'s skin`, `https://visage.surgeplay.com/head/512/${findPlayer.uuid}.png`)
    ]});
  } else
    message.channel.send('User not found');
};

const nameToUUID = async name => {
  const { body } = await fetch.get(`https://api.mojang.com/users/profiles/minecraft/${name}`);
  if (body.id) return { uuid: body.id, name: body.name };
  return false;
};

const uuidToName = async uuid => {
  const { body } = await fetch.get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
  if (body.id) return { uuid: body.id, name: body.name };
  return false;
};
  
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  cooldown: 2000
};

exports.help = {
  name: 'mcskin',
  description: "Retrieves a user's Minecraft skin",
  usage: 'mcskin [minecraft username]',
  example: 'mcskin Dream'
};

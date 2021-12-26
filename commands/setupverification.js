const { MessageEmbed, Permissions } = require('discord.js');

exports.run = async (client, message) => {
  try {
    if (client.guildData.get(message.guild.id).verificationSetUp == true)
      return message.reply('verification was already set up.');

    let role = message.guild.roles.resolve(client.settings.get(message.guild.id).verifiedRoleID);

    if (!role) {
      role = await message.guild.roles.create({ name: 'Verified User', color: 'BLURPLE', reason: 'setting up verification' });
      client.settings.set(message.guild.id, role.id, 'verifiedRoleID');
    }

    for (const chan of message.guild.channels.cache) {
      if (chan.name != 'verify') {
        if (chan.permissionsFor(message.guild.roles.everyone).has(Permissions.FLAGS.SEND_MESSAGES))
          chan.permissionOverwrites.edit(role, { SEND_MESSAGES: true });
        if (chan.permissionsFor(message.guild.roles.everyone).has(Permissions.FLAGS.VIEW_CHANNEL))
          chan.permissionOverwrites.edit(role, { VIEW_CHANNEL: true });
        if (chan.permissionsFor(message.guild.roles.everyone).has(Permissions.FLAGS.CONNECT))
          chan.permissionOverwrites.edit(role, { CONNECT: true });
        if (chan.permissionsFor(message.guild.roles.everyone).has(Permissions.FLAGS.SPEAK))
          chan.permissionOverwrites.edit(role, { SPEAK: true });
        chan.permissionOverwrites.edit(message.guild.roles.everyone, { SEND_MESSAGES: false, VIEW_CHANNEL: false, CONNECT: false, SPEAK: false });
      }
    }

    const verifyChannel = message.guild.channels.cache.find(c => c.name.toLowerCase() === 'verify') || await message.guild.channels.create('verify');
    verifyChannel.permissionOverwrites.edit(role, { VIEW_CHANNEL: false, SEND_MESSAGES: false });
    verifyChannel.permissionOverwrites.edit(message.guild.roles.everyone, { READ_MESSAGE_HISTORY: false });
    client.guildData.set(message.guild.id, true, 'verificationSetUp');
    message.channel.send('Set up verification successfully.');
  } catch (error) {
    return message.channel.send({embeds: [new MessageEmbed()
      .setColor('#FF0000')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`**Stack Trace:**\n\`\`\`${error.stack ?? error}\`\`\``)
      .addField('**Command:**', message.content)
    ]});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 3,
  cooldown: 5000
};

exports.help = {
  name: 'setupverification',
  description: 'Sets up verification',
  usage: 'setupverification',
  example: 'setupverification'
};

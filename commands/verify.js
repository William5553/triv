const { MessageEmbed } = require('discord.js');
const { formatDate } = require('../util/Util');

exports.run = async (client, message) => {
  try {
    const findVerify = message.guild.channels.cache.find(channel => channel.name === 'verify' && channel.type == 'text');
    if (findVerify && message.channel.id != findVerify.id)
      return message.reply(`this command can only be ran in ${findVerify}`);

    if (client.guildData.get(message.guild.id).verificationSetUp != true)
      return message.reply('this server has not set up verification yet.');

    let role = message.guild.roles.resolve(client.settings.get(message.guild.id).verifiedRoleID);

    if (!message.guild.me.hasPermission('MANAGE_ROLES'))
      return message.reply('I do not have the **MANAGE_ROLES** permission').catch(client.logger.error);

    if (!role) {
      role = await message.guild.roles.create({ data: { name: 'Verified User', color: 'BLURPLE' } });
      client.settings.set(message.guild.id, role.id, 'verifiedRoleID');
    }

    if (message.guild.me.roles.highest.comparePositionTo(role) < 1) return message.reply("I don't have control over the verified role, move my role above the verified role.");

    if (message.member.roles.cache.has(role.id)) {
      const m = await message.reply("you're already verified.");
      m.delete({ timeout: 3500 });
      message.delete({ timeout: 3500 });
    }
    message.member.roles
      .add(role.id, `Verified - ${formatDate()}`)
      .then(async () => {
        const m = await message.reply('you have been verified.');
        m.delete({ timeout: 3500 });
        message.delete({ timeout: 3500 });
      });
  } catch (err) {
    return message.channel.send(new MessageEmbed()
      .setColor('#FF0000')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`**Stack Trace:**\n\`\`\`${err.stack}\`\`\``)
      .addField('**Command:**', `${message.content}`)
    );
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0,
  cooldown: 1000
};

exports.help = {
  name: 'verify',
  description: 'Get the verified member role, only works if verification is set up.',
  usage: 'verify',
  example: 'verify'
};
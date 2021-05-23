const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
  try {
    if (client.guildData.get(message.guild.id).verificationSetUp != true)
      return message.reply('this server has not set up verification yet.');

    let role = message.guild.roles.resolve(client.settings.get(message.guild.id).verifiedRoleID);

    if (!message.guild.me.hasPermission('MANAGE_ROLES'))
      return message.reply('I do not have the **MANAGE_ROLES** permission').catch(client.logger.error);

    if (!role) {
      role = await message.guild.roles
        .create({
          data: {
            name: 'Verified User',
            color: 'BLURPLE'
          }
        })
        .catch(client.logger.error);
      client.settings.set(message.guild.id, role.id, 'verifiedRoleID');
    }

    if (message.guild.me.roles.highest.comparePositionTo(role) < 1) return message.reply("I don't have control over the verified role, move my role above the verified role.");

    if (message.member.roles.cache.has(role.id))
      return message.reply("you've already been verified.");
    
    message.member.roles
      .add(role.id, `Verified - ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' })}`)
      .then(async () => message.reply('you have been verified.'));
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

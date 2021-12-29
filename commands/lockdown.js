const ms = require('ms');
const { setTimeout } = require('node:timers');

exports.run = (client, message, args) => {
  if (!client.lockit) client.lockit = [];
  const time = args.join(' '),
    validUnlocks = ['release', 'unlock'];
  if (!time) return message.reply('You must specify a duration for the lockdown');
  if (validUnlocks.includes(time)) {
    message.channel.permissionOverwrites
      .edit(message.guild.roles.everyone, {
        SEND_MESSAGES: undefined
      })
      .then(() => {
        message.channel.send('Lockdown lifted.');
        clearTimeout(client.lockit[message.channel.id]);
        delete client.lockit[message.channel.id];
      });
  } else {
    if (ms(time) >= 2_147_483_647) return message.reply('Specified duration is too long');
    message.channel.permissionOverwrites
      .edit(message.guild.roles.everyone, {
        SEND_MESSAGES: false
      })
      .then(() => {
        message.channel
          .send(
            `Channel locked down for ${ms(ms(time), { long: true })}. To lift, run **${client.getPrefix(message)}lockdown ${validUnlocks.random()}**`
          )
          .then(() => {
            client.lockit[message.channel.id] = setTimeout(() => {
              message.channel.permissionOverwrites
                .edit(message.guild.roles.everyone, { SEND_MESSAGES: undefined })
                .then(message.channel.send('Lockdown lifted.'));
              delete client.lockit[message.channel.id];
            }, ms(time));
          });
      });
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['lock', 'ld'],
  permLevel: 2,
  cooldown: 5000
};

exports.help = {
  name: 'lockdown',
  description: 'This will lock a channel down for the specified duration, disallowing members to speak.',
  usage: 'lockdown [duration]',
  example: 'lockdown 10 minutes'
};

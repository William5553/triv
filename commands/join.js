exports.run = (client, message) => {
  const vc = message.member.voice.channel;

  if (vc) {
    const permissions = vc.permissionsFor(client.user);
    if (!permissions.has('CONNECT'))
      return message.reply('cannot connect to voice channel, missing the **CONNECT** permission');
    if (!permissions.has('SPEAK'))
      return message.reply('I cannot speak in this voice channel, make sure I have the **SPEAK** permission!');
    vc.join()
      .then(connection => {
        connection.voice.setSelfDeaf(true);
        return connection;
      })
      .catch(message.channel.send);
  } else return message.reply('you have to be in a voice channel moron');
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'join',
  description: 'Joins the voice channel',
  usage: 'join'
};

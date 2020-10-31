exports.run = (client, message) => {
  const settings = require('../settings.json');
  if (message.author.id !== settings.ownerid) return message.reply('you\'re not willeh!');
  message.channel.send('', {embed: {
    color: 0x00FF5C,
    author: {
      name: 'Guild(s)',
      icon_url: client.user.avatarURL
    },
    title: '** **',
    url: 'https://discordapp.com/oauth2/authorize?client_id=340942145051426828&scope=bot&permissions=536308991',
    description:  `**${client.guilds.size} guild(s):**\n\n*${client.guilds.map(g => g.name).join('\n')}*`,
    footer: {
      text: settings.bot_name
    }
  }});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 4
};

exports.help = {
  name: 'guilds',
  description: 'Shows all my guilds.',
  usage: 'guilds'
};

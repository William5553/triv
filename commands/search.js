const { MessageEmbed } = require('discord.js');
const YouTubeAPI = require('simple-youtube-api');
const process = require('node:process');
const youtube = new YouTubeAPI(process.env.google_api_key);

exports.run = async (client, message, args) => {
  if (!process.env.google_api_key) return message.reply('The bot owner has not set up this command yet');
  if (args.length === 0) return message.reply(`${client.getPrefix(message)}${exports.help.usage}`);
  if (message.channel.activeCollector) return message.reply('Somebody is already searching.');
  if (!message.member.voice.channel)
    return message.reply('You need to join a voice channel first!');

  const resultsEmbed = new MessageEmbed()
    .setTitle('**Reply with the song number you want to play**')
    .setDescription(`Results for: ${args.join(' ')}`)
    .setColor('#F8AA2A');

  try {
    const results = await youtube.searchVideos(args.join(' '), 10);
    results.map((video, index) => resultsEmbed.addField(video.shortURL, `${index + 1}. ${video.title}`));

    await message.channel.send({embeds: [resultsEmbed]});

    message.channel.activeCollector = true;

    const filter = msg => {
      const pattern = /^[1-9]0?(\s*,\s*[1-9]0?)*$/;
      return pattern.test(msg.content);
    };

    const response = await message.channel.awaitMessages({ filter, max: 1, time: 30_000, errors: ['time'] });

    const choice = resultsEmbed.fields[Number.parseInt(response.first()) - 1].name;

    message.channel.activeCollector = false;
    client.commands.get('play').run(client, message, [choice]);
  } catch (error) {
    client.logger.error(error);
    message.channel.activeCollector = false;
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0,
  cooldown: 7500
};

exports.help = {
  name: 'search',
  description: 'Search and select videos to listen to',
  usage: 'search [video name]',
  example: 'search rick roll'
};

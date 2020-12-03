const { MessageEmbed } = require('discord.js');
const ud = require('relevant-urban');
exports.run = async (client, message, args) => {
  const worder = args[0];
  if (!worder) return message.channel.send('Specify a word');
  const defin = await ud(args.join(' ')).catch(function() {
    return message.channel.send('Word not found');
  });
  
  const definition = defin.definition.substr(2000);
  const examp = defin.example.substr(2000);
  const embed = new MessageEmbed()
    .setTitle(defin.word)
    .setURL(defin.urbanURL)
    .setDescription(definition)
    .addField('Example', examp)
    .setFooter(`Author: ${defin.author}`)
    .setColor(0x0be05d);
  message.channel.send(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['ud', 'define'],
  permLevel: 0
};

exports.help = {
  name: 'urban',
  description: 'Searches for a term on the urban dictionary',
  usage: 'urban [term]',
  example: 'urban dark blockchain'
};

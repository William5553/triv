const {MessageEmbed} = require('discord.js');
const ud = require("relevant-urban");
exports.run = async (client, message, args) => {
  let worder = args[0];
if(!worder) return message.channel.send("Specify a word")
let defin = await ud(args.join(' ')).catch(e => {
  message.channel.send("Word not found")
  return;
});
let embed = new MessageEmbed()
.setTitle(defin.word)
.setURL(defin.urbanURL)
.setDescription(defin.definition)
.addField("Example", defin.example)
.setFooter(`Author: ${defin.author}`)
.setColor(0x0be05d)
message.channel.send(embed)
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['ud'],
  permLevel: 0
};

exports.help = {
  name: 'urban',
  description: 'Searches for a term on the urban dictionary',
  usage: 'urban [term]'
};

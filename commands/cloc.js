const { MessageEmbed } = require('discord.js');
const { promisify } = require('util');
const exec = promisify(require('child_process').execFile);
const path = require('path');

exports.run = async (client, message) => {
  const cloc = await cloc();
  const embed = new MessageEmbed()
    .setColor(0x00AE86)
    .setFooter(`${cloc.header.cloc_url} ${cloc.header.cloc_version}`)
    .addField(`❯ JS ${cloc.JavaScript.nFiles}`, cloc.JavaScript.code, true)
    .addField(`❯ JSON ${cloc.JSON.nFiles}`, cloc.JSON.code, true)
    .addField(`❯ MD ${cloc.Markdown.nFiles}`, cloc.Markdown.code, true)
    .addField('\u200B', '\u200B', true)
    .addField(`❯ Total ${cloc.SUM.nFiles}`, cloc.SUM.code, true)
    .addField('\u200B', '\u200B', true);
  return message.channel.send(embed);
};

async function cloc() {
  if (this.cache) return this.cache;
  const { stdout, stderr } = await exec(
    path.join(process.cwd(), 'node_modules', '.bin', 'cloc'),
    ['--json', '--exclude-dir=node_modules', path.join(process.cwd())]
  );
  if (stderr) throw new Error(stderr.trim());
  this.cache = JSON.parse(stdout.trim());
  return this.cache;
}
  
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['clc', 'codelinecount'],
  permLevel: 0
};

exports.help = {
  name: 'cloc',
  description: 'Count lines of code',
  usage: 'cloc'
};

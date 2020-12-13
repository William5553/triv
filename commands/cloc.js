const { MessageEmbed } = require('discord.js'),
  { promisify } = require('util'),
  exec = promisify(require('child_process').execFile),
  path = require('path');

async function clc() {
  if (this.cache) return this.cache;
  const { stdout, stderr } = await exec(
    path.join(process.cwd(), 'node_modules', '.bin', 'cloc'),
    ['--json', '--exclude-dir=node_modules', path.join(process.cwd())]
  );
  if (stderr) throw new Error(stderr.trim());
  this.cache = JSON.parse(stdout.trim());
  return this.cache;
}

exports.run = async (client, message) => {
  const cloc = await clc();
  return message.channel.send(new MessageEmbed()
    .setColor(0x00AE86)
    .setFooter(`${cloc.header.cloc_url} v${cloc.header.cloc_version}`)
    .addField(`❯ JavaScript: ${cloc.JavaScript.nFiles} files`, `${cloc.JavaScript.code} lines`, true)
    .addField(`❯ JSON: ${cloc.JSON.nFiles} files`, `${cloc.JSON.code} lines`, true)
    .addField('\u200B', '\u200B', true)
    .addField(`❯ Total: ${cloc.SUM.nFiles} files`, `${cloc.SUM.code} lines`, true)
    .addField('\u200B', '\u200B', true)
  );
};
  
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

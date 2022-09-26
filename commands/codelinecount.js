const { MessageEmbed } = require('discord.js');
const { promisify } = require('node:util');
const process = require('node:process');
const exec = promisify(require('node:child_process').execFile);
const path = require('node:path');

let cache;
  
const clc = async () => {
  if (cache) return cache;
  const { stdout, stderr } = await exec(
    path.join(process.cwd(), 'node_modules', '.bin', `cloc${process.platform === 'win32' ? '.cmd' : ''}`),
    ['--json', '--exclude-dir=node_modules', path.join(process.cwd())]
  );
  if (stderr) throw new Error(stderr.trim());
  cache = JSON.parse(stdout.trim());
  return cache;
};

exports.run = async (client, message) => {
  try {
    const cloc = await clc();
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor(0x00_AE_86)
        .setTitle(client.user.username)
        .setDescription('[View source code](https://github.com/William5553/triv)')
        .addFields([
          { name: 'JavaScript', value: `${cloc.JavaScript.nFiles} files\n${cloc.JavaScript.code} lines`, inline: true },
          { name: 'JSON', value: `${cloc.JSON.nFiles} files\n${cloc.JSON.code} lines`, inline: true },
          { name: 'Total', value: `${cloc.SUM.nFiles} files\n${cloc.SUM.code} lines`, inline: true }
        ])
    ]});
  } catch (error) {
    return message.channel.send({embeds: [
      new MessageEmbed()
        .setColor('#FF0000')
        .setTimestamp()
        .setTitle('Please report this on GitHub')
        .setURL('https://github.com/william5553/triv/issues')
        .setDescription(`**Stack Trace:**\n\`\`\`${error.stack ?? error}\`\`\``)
        .addFields({ name: '**Command:**', value: message.content })
    ]});
  }
};
  
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['clc', 'cloc'],
  permLevel: 0,
  cooldown: 120_000
};

exports.help = {
  name: 'codelinecount',
  description: 'Counts lines of code in the bot',
  usage: 'codelinecount',
  example: 'codelinecount'
};

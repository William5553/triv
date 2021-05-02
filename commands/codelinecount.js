const { MessageEmbed } = require('discord.js');
const { promisify } = require('util');
const exec = promisify(require('child_process').execFile);
const path = require('path');

let cache, filename;
if (process.platform === 'win32')
  filename = 'cloc.cmd';
else
  filename = 'cloc';
  
async function clc() {
  if (cache) return cache;
  const { stdout, stderr } = await exec(
    path.join(process.cwd(), 'node_modules', '.bin', filename),
    ['--json', '--exclude-dir=node_modules', path.join(process.cwd())]
  );
  if (stderr) throw new Error(stderr.trim());
  cache = JSON.parse(stdout.trim());
  return cache;
}

exports.run = async (client, message) => {
  try {
    const cloc = await clc();
    return message.channel.send(new MessageEmbed()
      .setColor(0x00AE86)
      .setTitle(client.user.username)
      .setDescription('[View source code](https://github.com/William5553/triv)')
      .addField(`❯ JavaScript: ${cloc.JavaScript.nFiles} files`, `${cloc.JavaScript.code} lines`, true)
      .addField(`❯ JSON: ${cloc.JSON.nFiles} files`, `${cloc.JSON.code} lines`, true)
      .addField(`❯ Total: ${cloc.SUM.nFiles} files`, `${cloc.SUM.code} lines`, true)
    );
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
  guildOnly: false,
  aliases: ['clc', 'cloc'],
  permLevel: 0,
  cooldown: 120000
};

exports.help = {
  name: 'codelinecount',
  description: 'Counts lines of code in the bot',
  usage: 'codelinecount',
  example: 'codelinecount'
};

if (Number(process.version.slice(1).split(".")[0]) < 12) throw new Error("Node 12.0.0 or higher is required. Update Node on your system.");
const { Client, Collection } = require('discord.js');
const client = new Client({ disableMentions: 'everyone' });
const fs = require('fs');
const settings = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));

client.logger = require('./util/logger');
require('./util/eventLoader')(client);
require('./util/functions')(client);

client.queue = new Map();

client.commands = new Collection();
client.aliases = new Collection();
fs.readdir('./commands/', (err, files) => {
  if (err) client.logger.error(err);
  client.logger.log(`Loading a total of ${files.length} commands.`);
  files.forEach(f => {
    client.load(f);
  });
});

client.on('warn', client.logger.warn);
client.on('error', client.logger.error);

try {
  client.login(settings.token);
} catch (e) {
  client.logger.error(e);
}

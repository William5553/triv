if (Number(process.version.slice(1).split('.')[0]) < 12) throw new Error('Node 12.0.0 or higher is required. Update Node on your system.');
const { Client, Collection } = require('discord.js');
const client = new Client({ disableMentions: 'everyone' });
const fs = require('fs');
const settings = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));

client.logger = require('./util/logger');
require('./util/functions')(client);

client.queue = new Collection();
client.games = new Collection();

client.commands = new Collection();
client.aliases = new Collection();
fs.readdir('./commands/', (err, files) => {
  if (err) client.logger.error(err);
  client.logger.log(`Loading a total of ${files.length} commands.`);
  files.forEach(file => {
    if (!file.endsWith('.js')) return;
    client.load(file);
  });
});

fs.readdir('./events/', (err, files) => {
  if (err) client.logger.error(err);
  client.logger.log(`Loading a total of ${files.length} events.`);
  files.forEach(file => {
    if (!file.endsWith('.js')) return;
    const eventName = file.split('.')[0];
    client.logger.log(`Loading Event: ${eventName}. 👌`);
    const event = require(`./events/${file}`);
    // Bind the client to any event, before the existing arguments provided by the discord.js event
    client.on(eventName, event.bind(null, client));
  });
});

client.login(settings.token);

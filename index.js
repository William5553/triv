if (Number(process.version.slice(1).split('.')[0]) < 12)
  throw new Error('Node 12.0.0 or higher is required. Update Node on your system.');

require('dotenv').config();

const { Client, Collection } = require('discord.js'),
  client = new Client({ disableMentions: 'everyone' }),
  { readdir } = require('fs');

client.logger = require('./util/logger');

if (!process.env.token) throw new Error('No token provided');

require('./util/functions')(client);

client.owners = [];

client.queue = new Collection();
client.games = new Collection();
client.snipes = new Collection();
client.commands = new Collection();
client.aliases = new Collection();

client.blacklist = { guild: [], user: [] };

readdir('./commands/', (err, files) => {
  if (err) client.logger.error(err);
  client.logger.log(`Loading a total of ${files.length} commands.`);
  files.forEach(file => {
    if (!file.endsWith('.js'))
      return client.logger.warn(`File not ending with .js found in commands folder: ${file}`);
    client.loadCommand(file);
  });
});

readdir('./events/', (err, files) => {
  if (err) client.logger.error(err);
  client.logger.log(`Loading a total of ${files.length} events.`);
  files.forEach(file => {
    if (!file.endsWith('.js'))
      return client.logger.warn(`File not ending with .js found in events folder: ${file}`);
    const eventName = file.split('.')[0];
    client.logger.log(`Loading Event: ${eventName}. 👌`);
    const event = require(`./events/${file}`);
    // Bind the client to any event, before the existing arguments provided by the discord.js event
    client.on(eventName, event.bind(null, client));
  });
});

(async function() {
  // Import blacklist
  try {
    const results = client.importBlacklist();
    if (!results) client.logger.error('[BLACKLIST] blacklist.json is not formatted correctly.');
  } catch (err) {
    client.logger.error(`[BLACKLIST] Could not parse blacklist.json:\n${err.stack}`);
  }

  // Make sure bot is not in any blacklisted guilds
  for (const id of client.blacklist.guild) {
    try {
      const guild = await client.guilds.fetch(id, false);
      await guild.leave();
      client.logger.log(`[BLACKLIST] Left blacklisted guild ${id}.`);
    } catch {
      if (!client.guilds.cache.has(id)) continue;
      client.logger.log(`[BLACKLIST] Failed to leave blacklisted guild ${id}.`);
    }
  }

  // Make sure bot is not in any guilds owned by a blacklisted user
  let guildsLeft = 0;
  for (const guild of client.guilds.cache.values()) {
    if (client.blacklist.user.includes(guild.ownerID)) {
      try {
        await guild.leave();
        guildsLeft++;
      } catch {
        client.logger.log(`[BLACKLIST] Failed to leave blacklisted guild ${guild.id}.`);
      }
    }
  }
  client.logger.log(`[BLACKLIST] Left ${guildsLeft} guilds owned by blacklisted users.`);
})();

client.login(process.env.token);

/*

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`Triv running Node.js ${process.version}`);
});

app.listen(8080);

*/

// These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
process.on('uncaughtException', err => {
  client.logger.error(`UNCAUGHT EXCEPTION: ${err.message}`);
  client.logger.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  client.logger.error(`UNHANDLED REJECTION: ${err.message}`);
  client.logger.error(err.stack);
});
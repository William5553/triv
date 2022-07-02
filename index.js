const process = require('node:process');
if (Number(process.version.slice(1).split('.')[0]) < 16) throw new Error('Node 16.9.0 or higher is required. Update Node on your system.');

if (!process.env.token) throw new Error('No token provided');

const { Client, Collection, Intents } = require('discord.js');
const client = new Client({
  intents: Object.values(Intents.FLAGS).reduce((acc, p) => acc | p, 0) || 32_767,
  partials: ['CHANNEL'/*, 'MESSAGE', 'REACTION', 'USER', 'GUILD_MEMBER'*/],
  allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
  waitGuildTimeout: 5000,
  presence: {
    status: 'online',
    activities: [{
      name: `${process.env.prefix}help`,
      type: 'LISTENING'
    }]
  }
});
const { readdir } = require('node:fs');
const Enmap = require('enmap');

client.logger = require('./util/logger');

require('./util/functions')(client);

client.evalDepth = 2;
client.owners = [];

client.queue = new Collection();
client.games = new Collection();
client.snipes = new Collection();
client.commands = new Collection();
client.aliases = new Collection();
client.blacklist = new Enmap({ name: 'blacklist' });
client.cooldowns = new Enmap({ name: 'cooldowns', fetchAll: false, autoFetch: true });
client.infractions = new Enmap({ name: 'infractions', fetchAll: false, autoFetch: true });
client.settings = new Enmap({ name: 'settings', fetchAll: false, autoFetch: true, cloneLevel: 'deep', autoEnsure: {
  prefix: process.env.prefix,
  joinRoleID: undefined,
  logsID: undefined,
  muteRoleID: undefined,
  verifiedRoleID: undefined
}});
client.guildData = new Enmap({ name: 'guilddata', fetchAll: false, autoFetch: true, cloneLevel: 'deep', autoEnsure: { disabled: [], verificationSetUp: false } });

readdir('./commands/', (err, files) => {
  if (err) client.logger.error(err);
  client.logger.log(`Loading a total of ${files.length} commands.`);
  files.forEach(async file => {
    if (!file.endsWith('.js'))
      return client.logger.warn(`File not ending with .js found in commands folder: ${file}`);
    const res = await client.loadCommand(file);
    if (res) client.logger.warn(res);
  });
});

readdir('./events/', (err, files) => {
  if (err) client.logger.error(err);
  client.logger.log(`Loading a total of ${files.length} events.`);
  for (const file of files) {
    if (!file.endsWith('.js'))
      return client.logger.warn(`File not ending with .js found in events folder: ${file}`);
    const eventName = file.split('.')[0];
    client.logger.log(`Loading Event: ${eventName}. 👌`);
    const event = require(`./events/${file}`);
    // Bind the client to any event, before the existing arguments provided by the discord.js event
    client.on(eventName, event.bind(undefined, client));
  }
});

(async () => {
  client.blacklist.ensure('blacklist', { guild: [], user: [] });
  // Make sure bot is not in any blacklisted guilds
  for (const id of client.blacklist.get('blacklist', 'user')) {
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
    if (client.blacklist.get('blacklist', 'user').includes(guild.ownerId)) {
      try {
        await guild.leave();
        guildsLeft++;
      } catch {
        client.logger.log(`[BLACKLIST] Failed to leave blacklisted guild ${guild.id} (${guild.name}).`);
      }
    }
  }
  client.logger.log(`[BLACKLIST] Left ${guildsLeft} guilds owned by blacklisted users.`);
})();

try {
  client.login(process.env.token);
} catch (error) {
  client.logger.error(`ERROR WHILE LOGGING IN:\n${error.stack ?? error}`);
}

if (process.env.triv_web) {
  const express = require('express');
  const app = express();

  app.get('*', (req, res) => res.send(`${client.user?.username || 'Triv'} running Node.js ${process.version}`));

  app.listen(process.env.PORT ?? 8080);
}

// These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
process.on('uncaughtException', err => {
  client.logger.error(`UNCAUGHT EXCEPTION:\n${err.stack ?? err}`);
  process.exit(1);
});

process.on('unhandledRejection', err => client.logger.error(`UNHANDLED REJECTION:\n${err.stack ?? err}\n`));
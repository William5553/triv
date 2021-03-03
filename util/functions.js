const fs = require('fs'),
  path = require('path');

module.exports = client => {
  client.loadCommand = async command => {
    const props = require(`../commands/${command}`);
    if (!props.conf || !props.help) return client.logger.error(`${command} failed to load as it is missing required command configuration`);
    if (props.conf.enabled !== true) return client.logger.log(`${props.help.name} is disabled.`);
    client.logger.log(`Loading Command: ${props.help.name}. 👌`);
    if (props.help.name !== command.split('.')[0]) client.logger.warn(`File name ${command} has a different command name ${props.help.name}`);
    if (client.aliases.has(props.help.name))
      client.logger.warn(`${props.help.name} tried to load but it's already being used as an alias for ${client.aliases.get(props.help.name)}`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.logger.log(`Loading Alias: ${alias}. 👌`);
      if (client.aliases.has(alias) || client.commands.has(alias))
        client.logger.warn(`${props.help.name} tried to use alias ${alias} but it is already being used by ${client.aliases.has(alias) ? client.aliases.get(alias) : 'a command'}`);
      else
        client.aliases.set(alias, props.help.name);
    });
  };

  client.unloadCommand = async commandName => {
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`;

    client.logger.log(`Unloading Command: ${command.help.name}. 👌`);
    client.commands.delete(command.help.name);
    command.conf.aliases.forEach(alias => {
      client.logger.log(`Unloading Alias: ${alias}. 👌`);
      client.aliases.delete(alias);
    });
    delete require.cache[require.resolve(`../commands/${command.help.name}.js`)];
    return `Successfully unloaded ${command.help.name}`;
  };

  /*
  PERMISSION LEVEL FUNCTION
  This is a very basic permission system for commands which uses "levels"
  0 = member
  2 = mod
  3 = admin
  4 = guild owner
  10 = bot owner
  */
  client.elevation = message => {
    let permlvl = 0;
    if (message.member.hasPermission('MANAGE_MESSAGES'))
      permlvl = 2;
    if (message.member.hasPermission('ADMINISTRATOR') || message.member.hasPermission('MANAGE_GUILD'))
      permlvl = 3;
    if (message.author.id == message.guild.ownerID)
      permlvl = 4;
    if (client.owners.includes(message.author.id))
      permlvl = 10;
    return permlvl;
  };
  
  client.importBlacklist = async () => {
    let file;
    try {
      file = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'blacklist.json'), { encoding: 'utf8' }));
    } catch {
      fs.writeFile('blacklist.json', '{\n  "guild": [],\n  "user": []\n}', e => {
        if (e) throw e;
      });
      await client.wait(750);
      file = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'blacklist.json'), { encoding: 'utf8' }));
    }
    if (typeof file !== 'object' || Array.isArray(file)) return null;
    if (!file.guild || !file.user) return null;
    for (const id of file.guild) {
      if (typeof id !== 'string') continue;
      if (client.blacklist.guild.includes(id)) continue;
      client.blacklist.guild.push(id);
    }
    for (const id of file.user) {
      if (typeof id !== 'string') continue;
      if (client.blacklist.user.includes(id)) continue;
      client.blacklist.user.push(id);
    }
    return file;
  };

  client.exportBlacklist = () => {
    let text = '{\n	"guild": [\n		';
    if (client.blacklist.guild.length) {
      for (const id of client.blacklist.guild) {
        text += `"${id}",\n		`;
      }
      text = text.slice(0, -4);
    }
    text += '\n	],\n	"user": [\n		';
    if (client.blacklist.user.length) {
      for (const id of client.blacklist.user) {
        text += `"${id}",\n		`;
      }
      text = text.slice(0, -4);
    }
    text += '\n	]\n}\n';
    const buf = Buffer.from(text);
    fs.writeFileSync(path.join(process.cwd(), 'blacklist.json'), buf, { encoding: 'utf8' });
    return buf;
  };

  // `await client.wait(1000);` to "pause" for 1 second.
  client.wait = require('util').promisify(setTimeout);

  /* MISCELANEOUS NON-CRITICAL FUNCTIONS */

  // EXTENDING NATIVE TYPES IS BAD PRACTICE. Why? Because if JavaScript adds this
  // later, this conflicts with native code. Also, if some other lib you use does
  // this, a conflict also occurs. KNOWING THIS however, the following 2 methods
  // are, we feel, very useful in code.

  // <String>.toPropercase() returns a proper-cased string such as: 
  // "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"
  Object.defineProperty(String.prototype, 'toProperCase', {
    value: function() {
      return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
  });

  // <Array>.random() returns a single random element from an array
  // [1, 2, 3, 4, 5].random() can return 1, 2, 3, 4 or 5.
  Object.defineProperty(Array.prototype, 'random', {
    value: function() {
      return this[Math.floor(Math.random() * this.length)];
    }
  });
  
  
  Object.defineProperty(Array.prototype, 'shuffle', {
    value: function() {
      const arr = this.slice(0);
      for (let i = arr.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
      return arr;
    }
  });
};

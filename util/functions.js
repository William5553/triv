const yes = ['true', 'yes', 'y', 'ye', 'yeah', 'yup', 'yea', 'ya', 'yas', 'yuh', 'yis', 'hai', 'si', 'sí', 'oui', 'はい', 'correct', 'perhaps', 'absolutely', 'sure'];
const no = ['false', 'no', 'n', 'nah', 'nah foo', 'nope', 'nop', 'iie', 'いいえ', 'non', 'fuck off', 'absolutely not'];
module.exports = client => {
  client.load = async command => {
    const props = require(`../commands/${command}`);
    if (!props.conf || !props.help) return client.logger.error(`${command} failed to load as it is missing required command configuration`);
    if (props.conf.enabled !== true) return client.logger.log(`${props.help.name} is disabled.`);
    client.logger.log(`Loading Command: ${props.help.name}. 👌`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
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
    if (message.author.id == message.guild.ownerID) permlvl = 4;
    if (message.author.id === client.settings.owner_id) permlvl = 10;
    return permlvl;
  };


  /*
  SINGLE-LINE AWAITMESSAGE
  A simple way to grab a single reply, from the user that initiated
  the command. Useful to get "precisions" on certain things...
  USAGE
  const response = await client.awaitReply(msg, "Favourite Color?");
  msg.reply(`Oh, I really love ${response} too!`);
  */
  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m => m.author.id === msg.author.id;
    if (question) await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, {
        max: 1,
        time: limit,
        errors: ['time']
      });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };
  client.verify = async (channel, user, { time = 30000, extraYes = [], extraNo = [] } = {}) => {
    const filter = res => {
      const value = res.content.toLowerCase();
      return (user ? res.author.id === user.id : true)
				&& (yes.includes(value) || no.includes(value) || extraYes.includes(value) || extraNo.includes(value));
    };
    const verify = await channel.awaitMessages(filter, {
      max: 1,
      time
    });
    if (!verify.size) return 0;
    const choice = verify.first().content.toLowerCase();
    if (yes.includes(choice) || extraYes.includes(choice)) return true;
    if (no.includes(choice) || extraNo.includes(choice)) return false;
    return false;
  };
  /*
  MESSAGE CLEAN FUNCTION
  "Clean" removes @everyone pings, as well as tokens, and makes code blocks
  escaped so they're shown more easily. As a bonus it resolves promises
  and stringifies objects!
  This is mostly only used by the Eval and Exec commands.
  */
  client.clean = async (text) => {
    if (text && text.constructor.name == 'Promise')
      text = await text;
    if (typeof text !== 'string')
      text = require('util').inspect(text, {depth: 1});

    text = text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203))
      .replace(client.token, 'NO TOKEN');

    return text;
  };

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

  // `await client.wait(1000);` to "pause" for 1 second.
  client.wait = require('util').promisify(setTimeout);

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
};

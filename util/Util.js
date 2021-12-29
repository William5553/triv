const yes = new Set(['true', 'yes', 'y', 'да', 'ye', 'yeah', 'yup', 'yea', 'ya', 'yas', 'yuh', 'yee', 'i guess', 'fosho', 'yis', 'hai', 'da', 'si', 'sí', 'oui', 'はい', 'correct', 'perhaps', 'absolutely', 'sure']);
const no = new Set(['false', 'no', 'n', 'nah', 'eat shit', 'nah foo', 'nope', 'nop', 'die', 'いいえ', 'non', 'fuck off', 'absolutely not']);
const langs = require('../assets/languages.json');
const { URL } = require('node:url');
const process = require('node:process');

module.exports = class Util {
  static async verify(channel, user, { time = 30_000, extraYes = [], extraNo = [] } = {}) {
    if (channel.client.blacklist.get('blacklist', 'user').includes(user.id)) {
      channel.send(`${user.tag} is currently blacklisted`);
      return false;
    }
    const filter = res => {
      const value = res.content.toLowerCase();
      return (user ? res.author.id === user.id : true) && (yes.has(value) || no.has(value) || extraYes.includes(value) || extraNo.includes(value));
    };
    const verify = await channel.awaitMessages({ filter, max: 1, time });
    if (verify.size === 0) return false;
    const choice = verify.first().content.toLowerCase();
    if (yes.has(choice) || extraYes.includes(choice)) return true;
    if (no.has(choice) || extraNo.includes(choice)) return false;
    return false;
  }

  /*
  MESSAGE CLEAN FUNCTION
  "Clean" removes @everyone pings, as well as tokens, and makes code blocks
  escaped so they're shown more easily. As a bonus it resolves promises
  and stringifies objects!
  This is mostly only used by the Eval and Exec commands.
  */
  static async clean(text) {
    if (text && text.constructor.name == 'Promise')
      text = await text;
    if (typeof text !== 'string')
      text = require('node:util').inspect(text, { depth: 1 });

    text = text
      .replaceAll('@', `@${String.fromCodePoint(8203)}`)
      .replace(process.env.token, 'NO TOKEN')
      .replaceAll('```', '`\u200B``');

    return text;
  }

  static formatNumber(number) {
    return Number.parseFloat(number).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }

  static canModifyQueue(member) {
    const client = member?.client;
    const memChan = member?.voice?.channelId;
    const botChan = member?.guild?.me.voice?.channelId;
    const queue = client.queue.get(member.guild.id);
    
    if (member.isCommunicationDisabled())
      return "You're currently timed out";
    if (queue && queue.forced && !client.owners.includes(member.id))
      return 'no.';
    if (client.blacklist.get('blacklist', 'user').includes(member.id))
      return 'You are blacklisted';
    if (client.owneronlymode && !client.owners.includes(member.id))
      return 'The bot is currently in owner only mode';
    if (memChan === botChan || client.owners.includes(member.id))
      return true;
    return 'You need to join the voice channel first!';
  }

  static parseUser(message, member) {
    if (member.user === message.client.user)
      return message.reply('You are an idiot');
    if (member.user === message.author)
      return message.reply("You can't do that to yourself, you are an idiot.");
    if (message.client.owners.includes(member.id))
      return message.reply('no.');
    if (member?.roles?.highest.position >= message.member.roles.highest.position && !message.client.owners.includes(message.author.id))
      return message.reply('That member is higher or equal to you. L');
    if (member?.roles?.highest.position >= message.guild.me.roles.highest.position || !member.manageable)
      return message.reply('That member is higher or equal to me, try moving my role higher');
    return true;
  }

  static formatDate(date = Date.now()) {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' });
  }

  static async caseNumber(client, botlog) {
    const messages = await botlog.messages.fetch({ limit: 30 });
    const log = messages
      .filter(
        m =>
          m.author.id === client.user.id &&
          m.embeds[0] &&
          m.embeds[0].footer &&
          m.embeds[0].footer.text.startsWith('ID')
      )
      .first();
    if (!log) return 1;
    const thisCase = /ID\s(\d+)/.exec(log.embeds[0].footer.text);
    return thisCase ? Number.parseInt(thisCase[1]) + 1 : 1;
  }

  static getCode(language) {
    if (!language)
      return false;
    if (langs[language])
      return langs[language];
    const key = Object.keys(langs).find(item => langs[item] === language.toLowerCase());
    if (key)
      return langs[key];
    return false;
  }

  /*
  SINGLE-LINE AWAITMESSAGE
  A simple way to grab a single reply, from the user that initiated
  the command. Useful to get "precisions" on certain things...
  USAGE
  const response = await client.awaitReply(message, "Favourite Color?");
  message.reply(`Oh, I really love ${response.content} too!`);
  */
  static async awaitReply(message, question, limit = 60_000) {
    const filter = m => m.author.id === message.author.id;
    if (question) await message.channel.send(question);
    try {
      const collected = await message.channel.awaitMessages({ filter, max: 1, time: limit, errors: ['time'] });
      return collected.first();
    } catch {
      return false;
    }
  }

  static validUrl(s, protocols = ['https', 'http']) {
    try {
      const url = new URL(s);
      return protocols
        ? url.protocol
          ? protocols.map(x => `${x.toLowerCase()}:`).includes(url.protocol)
          : false
        : true;
    } catch {
      return false;
    }
  }
};

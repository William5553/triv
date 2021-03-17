const yes = ['true', 'yes', 'y', 'да', 'ye', 'yeah', 'yup', 'yea', 'ya', 'yas', 'yuh', 'yee', 'i guess', 'fosho', 'yis', 'hai', 'da', 'si', 'sí', 'oui', 'はい', 'correct', 'perhaps', 'absolutely', 'sure'],
  no = ['false', 'no', 'n', 'nah', 'eat shit', 'nah foo', 'nope', 'nop', 'die', 'いいえ', 'non', 'fuck off', 'absolutely not'];

module.exports = class Util {
  static async verify(channel, user, { time = 30000, extraYes = [], extraNo = [] } = {}) {
    if (channel.client.blacklist.user.includes(user.id)) {
      channel.send(`${user.tag} is currently blacklisted`);
      return false;
    }
    const filter = res => {
      const value = res.content.toLowerCase();
      return (user ? res.author.id === user.id : true) && (yes.includes(value) || no.includes(value) || extraYes.includes(value) || extraNo.includes(value));
    };
    const verify = await channel.awaitMessages(filter, {
      max: 1,
      time,
      errors: ['time']
    });
    if (!verify.size) return 0;
    const choice = verify.first().content.toLowerCase();
    if (yes.includes(choice) || extraYes.includes(choice)) return true;
    if (no.includes(choice) || extraNo.includes(choice)) return false;
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
      text = require('util').inspect(text, {depth: 1});

    text = text
      .replace(/@/g, '@' + String.fromCharCode(8203))
      .replace(process.env.token, 'NO TOKEN');

    return text;
  }

  static formatNumber(number, minimumFractionDigits = 0) {
    return Number.parseFloat(number).toLocaleString(undefined, {
      minimumFractionDigits,
      maximumFractionDigits: 2
    });
  }

  static canModifyQueue(member) {
    if (!member || !member.voice || !member.guild.voice) return member.client.logger.error('member.voice or member.guild.voice is not present');
    const client = member.client,
      memChan = member.voice.channelID,
      botChan = member.guild.voice.channelID;
    
    if (client.blacklist.user.includes(member.user.id)) {
      member.send('You are blacklisted').catch(client.logger.error);
      return false;
    }
    if (memChan === botChan || client.owners.includes(member.user.id))
      return true;
    member.send('You need to join the voice channel first!').catch(client.logger.error);
    return false;
  }

  static parseUser(message, member) {
    if (member.user === message.client.user)
      return message.reply('you are an idiot');
    if (member.user === message.author)
      return message.reply("you can't do that to yourself, why did you try? you are an idiot.");
    if (message.client.owners.includes(member.user.id))
      return message.reply('no!');
    if (member && member.roles && member.roles.highest.position >= message.member.roles.highest.position)
      return message.reply('that member is higher or equal to you. L');
    if (member && member.roles && member.roles.highest.position >= message.guild.me.roles.highest.position)
      return message.reply('that member is higher or equal to me, try moving my role higher');
    return true;
  }

  static async caseNumber(client, botlog) {
    const messages = await botlog.messages.fetch({ limit: 16 });
    const log = messages
      .filter(
        m =>
          m.author.id === client.user.id &&
          m.embeds[0] &&
          m.embeds[0].type === 'rich' &&
          m.embeds[0].footer &&
          m.embeds[0].footer.text.startsWith('ID')
      )
      .first();
    if (!log) return 1;
    const thisCase = /ID\s(\d+)/.exec(log.embeds[0].footer.text);
    return thisCase ? parseInt(thisCase[1]) + 1 : 1;
  }
};

exports.run = (client, message) => {


  const enabled = true;



  if (enabled == true) {
    message.channel.send('**RICK ROLL INCOMING**');
    message.channel.send('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    thing();
    chorus();
    say('We\'ve known each other for so long');
    say('Your heart\'s been aching but you\'re too shy to say it');
    say('Inside we both know what\'s been going on');
    say('We know the game and we\'re gonna play it');
    say('And if you ask me how I\'m feeling');
    say('Don\'t tell me you\'re too blind to see');
    chorus();
    chorus();
    thing();
    chorus();
    chorus();
    chorus();


    function say(text) {  // eslint-disable-line no-inner-declarations
      message.channel.send(text);
    }

    function chorus() {  // eslint-disable-line no-inner-declarations
      say('Never gonna give you up');
      say('Never gonna let you down');
      say('Never gonna run around and desert you');
      say('Never gonna make you cry');
      say('Never gonna say goodbye');
      say('Never gonna tell a lie and hurt you');
    }

    function thing() {  // eslint-disable-line no-inner-declarations
      say('We\'re no strangers to love');
      say('You know the rules and so do I');
      say('A full commitment\'s what I\'m thinking of');
      say('You wouldn\'t get this from any other guy');
      say('I just wanna tell you how I\'m feeling');
      say('Gotta make you understand');
    }

  } else {
    return message.channel.send('Currently disabled, sorry.');
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'surprise',
  description: 'Give you a surprise',
  usage: 'surprise'
};

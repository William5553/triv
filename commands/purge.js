exports.run = (client, message, args) => {
  // This time we have to use startsWith, since we will be adding a number to the end of the command.
  // We have to wrap this in an async since awaits only work in them.
  async function purge() {
    message.delete(); // Let's delete the command message, so it doesn't interfere with the messages we are going to delete.
    const mgct = Number(args.slice(0).join(' '));
    // We want to check if the argument is a number
    if (mgct < 2) {
      return message.channel.send('Please enter a number *higher* than 2');
    }
    if (isNaN(mgct)) {
      // Sends a message to the channel.
      message.channel.send('How many messages? That isn\'t a number'); // \n means new line.
      // Cancels out of the script, so the rest doesn't run.
      return;
    }
    if (mgct > 99) return message.reply('I can only do 99 messages at a time');
    const fetched = await message.channel.fetchMessages({limit: mgct}); // This grabs the last number(args) of messages in the channel.
    message.channel.send(fetched.size + ' messages found.\nDeleting...').then(msg => {msg.delete(1000);
    })
      .catch(/*Your Error handling if the Message isn't returned, sent, etc.*/); // Lets post into console how many messages we are deleting
    // Deleting the messages
    message.channel.bulkDelete(fetched)
      .catch(error => message.channel.send(`Error: **${error}**`)); // If it finds an error, it posts it into the channel.

  }
  purge();
};





exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: 'purge',
  description: 'Deletes the specified amount of messages.',
  usage: 'purge [amount]'
};

exports.run = (client, message, args) => {
  async function purge() {
    message.delete(); // Let's delete the command message, so it doesn't interfere with the messages we are going to delete.
    let mgct = Number(args.slice(0).join(' '));
    // We want to check if the argument is a number
    if (mgct < 2) {
      return message.channel.send('Please enter a number *higher* than 2');
    }
    if (isNaN(mgct)) return message.channel.send('How many messages? That isn\'t a number');
    if (mgct > 99) let mgct = 100;
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

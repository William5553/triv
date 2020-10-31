exports.run = (client, message, args) => {
  async function purge() {
    message.delete(); // Let's delete the command message, so it doesn't interfere with the messages we are going to delete.
    let mgct = Number(args.slice(0).join(' '));
    // We want to check if the argument is a number
    if (mgct < 2) {
      return message.channel.send('Please enter a number *higher* than 2');
    }
    if (isNaN(mgct)) return message.channel.send('How many messages? That isn\'t a number');
    if (mgct > 99) mgct = 100;
    // Deleting the messages
    message.channel.bulkDelete(mgct)
      .catch(error => message.channel.send(`Error: **${error}**`));
  }
  purge();
};





exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['prune'],
  permLevel: 2
};

exports.help = {
  name: 'purge',
  description: 'Deletes the specified amount of messages.',
  usage: 'purge [amount]'
};

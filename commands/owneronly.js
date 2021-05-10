exports.run = (client, message) => {
  client.owneronlymode = !client.owneronlymode;
  message.reply(`I am ${client.owneronlymode ? 'now' : 'no longer'} in owner only mode`);
};
    
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['oo'],
  permLevel: 10
};
    
exports.help = {
  name: 'owneronly',
  description: 'Makes it so only the owner can run commands',
  usage: 'owneronly',
  example: 'owneronly'
};
    
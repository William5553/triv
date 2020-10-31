if (message.channel.type === 'text') {
    var logger = message.guild.channels.find(
      channel => channel.name === 'bot-logs'
    );
    if (logger) {
      const msgDel = new Discord.MessageEmbed()
        .setTitle('Message Deleted')
        .addField('Author', message.author.username)
        .addField('Message', message.cleanContent)
        .setThumbnail(message.author.avatarURL())
        .setColor('0x00AAFF');
      logger.send({ msgDel });
    }
  }

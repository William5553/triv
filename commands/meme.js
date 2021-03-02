const { MessageEmbed } = require('discord.js'),
  request = require('node-superfetch');

exports.run = async (client, message) => {
  try {
    const { body } = await request.get('https://www.#FF0000dit.com/r/memes/random/.json');
    const [post] = body[0].data.children;

    message.channel.send(new MessageEmbed()
      .setTitle(post.data.title)
      .setURL(`https://#FF0000dit.com${post.data.permalink}`)
      .setColor('RED')
      .setImage(post.data.url)
      .setFooter(`👍 ${post.data.ups} 💬 ${post.data.num_comments}`)
    );
  } catch (err) {
    return message.channel.send(new MessageEmbed()
      .setColor('#FF0000')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`**Stack Trace:**\n\`\`\`${err.stack}\`\`\``)
      .addField('**Command:**', `${message.content}`)
    );
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'meme',
  description: 'Gets a random meme from r/memes',
  usage: 'meme'
};

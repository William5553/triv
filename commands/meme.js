const { MessageEmbed } = require('discord.js'),
  request = require('node-superfetch');

exports.run = async (client, message) => {
  try {
    const { body } = await request.get('https://www.reddit.com/r/memes.json?sort=top&t=week');
    const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
    if (!allowed.length) return message.channel.send('It seems we are out of fresh memes!, Try again later.');

    const post = allowed.random();
    message.channel.send(new MessageEmbed()
      .setTitle(post.data.title)
      .setURL(`https://reddit.com${post.data.permalink}`)
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

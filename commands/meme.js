const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');

exports.run = async (client, message, args) => {
  try {
    const subreddit = args[0] || 'memes';

    const { body } = await request.get(`https://www.reddit.com/r/${encodeURIComponent(subreddit)}.json?sort=top&t=week`);
    const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
    if (allowed.length === 0) return message.channel.send('It seems we are out of fresh memes! Try again later.');

    const post = allowed.random();
    message.channel.send({embeds: [new MessageEmbed()
      .setTitle(post.data.title)
      .setURL(`https://reddit.com${post.data.permalink}`)
      .setColor('RED')
      .setImage(post.data.url || post.data.url_overridden_by_dest)
      .setFooter({ text: `👍 ${post.data.ups} | 💬 ${post.data.num_comments}` })
    ]});
  } catch (error) {
    return message.channel.send({embeds: [new MessageEmbed()
      .setColor('#FF0000')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`**Stack Trace:**\n\`\`\`${error.stack ?? error}\`\`\``)
      .addFields({ name: '**Command:**', value: message.content })
    ]});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  cooldown: 5000
};

exports.help = {
  name: 'meme',
  description: 'Gets a random meme from r/memes or a specified subreddit',
  usage: 'meme [subreddit (optional)]',
  example: 'meme'
};

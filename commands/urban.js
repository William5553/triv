const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
exports.run = async (client, message, args) => {
  const word = args.join(' ');
  if (!word) return message.channel.send('Specify a word');
  const { body } = await request
				.get('http://api.urbandictionary.com/v0/define')
				.query({ term: word });
			if (!body.list.length) return message.channel.send('Could not find any results');
			const data = body.list[0];
			const embed = new MessageEmbed()
				.setColor(0x32A8F0)
				.setAuthor('Urban Dictionary', 'https://i.imgur.com/Fo0nRTe.png', 'https://www.urbandictionary.com/')
				.setURL(data.permalink)
				.setTitle(data.word)
				.setDescription(data.definition.replace(/\[|\]/g, '').substr(0,1200))
				.setFooter(`👍 ${data.thumbs_up} 👎 ${data.thumbs_down}`)
				.setTimestamp(new Date(data.written_on))
				.addField('❯ Example', data.example ? data.example.replace(/\[|\]/g, '').substr(0,800) : 'None');
			return message.channel.send(embed).catch(client.logger.error);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['ud', 'define'],
  permLevel: 0
};

exports.help = {
  name: 'urban',
  description: 'Searches for a term on the urban dictionary',
  usage: 'urban [term]',
  example: 'urban dark blockchain'
};

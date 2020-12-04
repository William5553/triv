const request = require('node-superfetch');
exports.run = (client, msg, args) => {
try {
if (!args.size) return msg.reply('say a name, moron');
			const { body } = await request
				.get(`https://api.genderize.io/`)
				.query({ args[0] });
			if (!body.gender) return msg.channel.send(`I have no idea what gender ${body.name} is.`);
			return msg.channel.send(`I'm ${Math.round(body.probability * 100)}% sure ${body.name} is a ${body.gender} name.`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
    };
    
    exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'gender',
  description: 'Determines the gender of a name',
  usage: 'gender [name]',
  example: 'gender Riley'
};

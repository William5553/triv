const { MessageEmbed } = require('discord.js');
const fetch = require('node-superfetch');

exports.run = async (client, message, args) => {
  try {
    if (!process.env.wolfram_api_key) return message.reply('the bot owner has not set up this command yet');
    if (args.length < 1) return message.reply(`usage: ${client.getPrefix(message)}${exports.help.usage}`);
    const m = await message.channel.send('*Querying Wolfram Alpha...*');
    let { body } = await fetch.get(`http://api.wolframalpha.com/v2/query?appid=${process.env.wolfram_api_key}&input=${encodeURIComponent(args.join(' '))}&output=json`);
    body = JSON.parse(body);
    if (body.queryresult.success == true) {
      m.delete();
      if (Object.prototype.hasOwnProperty.call(body.queryresult, 'warnings')) {
        for (const i in body.queryresult.warnings) {
          for (const j in body.queryresult.warnings[i]) {
            if (j != '$') {
              try {
                message.channel.send(body.queryresult.warnings[i][j][0].text);
              } catch (e) {
                client.logger.warn(`WolframAlpha: failed displaying warning: ${e.stack}`);
              }
            }
          }
        }
      }
      if (Object.prototype.hasOwnProperty.call(body.queryresult, 'assumptions')) {
        for (const i in body.queryresult.assumptions) {
          for (const j in body.queryresult.assumptions[i]) {
            if (j == 'assumption') {
              try {
                message.channel.send(`Assuming ${body.queryresult.assumptions[i][j][0].word} is ${body.queryresult.assumptions[i][j][0].value[0].desc}`);
              } catch (e) {
                client.logger.warn(`WolframAlpha: failed displaying assumption: ${e.stack}`);
              }
            }
          }
        }
      }
      const embeds = [];
      const embedz = [];
      let messagee;
      for (let a = 0; a < body.queryresult.pods.length; a++) {
        const pod = body.queryresult.pods[a];
        const title = `**${pod.title}**`;
        for (let b = 0; b < pod.subpods.length; b++) {
          const subpod = pod.subpods[b];
          // can also display the plain text, but the images are prettier
          /*for(let c = 0; c < subpod.plaintext.length; c++) {
              response += '\t'+subpod.plaintext[c];
            } */
          const embed = new MessageEmbed()
            .setTitle(title)
            .setDescription(subpod.plaintext)
            .setColor(0xff9339)
            .setImage(subpod.img.src);
          if (subpod.title.length > 0) 
            embed.description = subpod.title;
          embeds.push(embed);
        }
        if (Object.prototype.hasOwnProperty.call(pod, 'infos')) {
          messagee = `${title}\nAdditional Info:`;
          for (const infos of pod.infos) {	
            for (const info of infos.info) {
              if (Object.prototype.hasOwnProperty.call(info, '$') && Object.prototype.hasOwnProperty.call(info, 'text')) 
                message += '\n' + info.text;
              if (Object.prototype.hasOwnProperty.call(info, 'link')) {
                for (const link of info.link) 
                  messagee += '\n' + `${link.title} ${link.text}: ${link.url}`;
              }
              if (Object.prototype.hasOwnProperty.call(info, 'img')) {
                for (const img of info.img) 
                  embedz.push(new MessageEmbed()
                    .setDescription(img.title)
                    .setImage(img.src.url)
                    .setColor(0xffc230)
                  );
              }	
            }
          }
          message.channel.send(messagee, embedz);
        }
      }
      if (!embeds || embeds.length < 1) return message.channel.send('No results from Wolfram Alpha.');
      let currPage = 0;
  
      const emb = await message.channel.send(`**${currPage + 1}/${embeds.length}**`, embeds[currPage]);
      if (embeds.length > 1) {
        await emb.react('⬅️');
        await emb.react('➡️');

        const filter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && message.author.id === user.id;
        const collector = emb.createReactionCollector(filter, {});
  
        collector.on('collect', async reaction => {
          try {
            if (reaction.emoji.name === '➡️') {
              if (currPage < embeds.length - 1) {
                currPage++;
                emb.edit(`**${currPage + 1}/${embeds.length}**`, embeds[currPage]);
              }
            } else if (reaction.emoji.name === '⬅️') {
              if (currPage !== 0) {
                --currPage;
                emb.edit(`**${currPage + 1}/${embeds.length}**`, embeds[currPage]);
              }
            }
            await reaction.users.remove(message.author.id);
          } catch (e) {
            client.logger.error(e.stack || e);
            return message.channel.send('**Missing Permissions - [ADD_REACTIONS, MANAGE_MESSAGES]!**');
          }
        });
      }
    } else if (Object.prototype.hasOwnProperty.call(body.queryresult, 'didyoumeans')) {
      const msg = [];
      for (const i in body.queryresult.didyoumeans) {
        for (const j in body.queryresult.didyoumeans[i].didyoumean)
          msg.push(body.queryresult.didyoumeans[i].didyoumean[j]._);
      }
      m.edit(`Did you mean: ${msg.join(' ')}`);
    } else
      m.edit('No results from Wolfram Alpha');
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
  aliases: ['wa', 'wolfram'],
  permLevel: 0,
  cooldown: 5000
};
  
exports.help = {
  name: 'wolframalpha',
  description: 'Queries wolfram alpha',
  usage: 'wolframalpha [query]',
  example: 'wolframalpha 2+2'
};
  
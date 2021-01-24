const request = require('node-superfetch'),
  { MessageEmbed } = require('discord.js');

exports.run = async (client, msg, args) => {
  try {
    if (args.length < 1) return msg.channel.send(`${client.settings.prefix}${exports.help.usage}`);
    const query = args.join(' ');
    const company = await search(query);
    if (!company) return msg.channel.send('Could not find any results.');
    const stocks = await fetchStocks(company.symbol, client.settings.alphavantage_key);
    if (!stocks) return msg.channel.send('Could not find any results.');
    return msg.channel.send(new MessageEmbed()
      .setTitle(`Stocks for ${company.name} (${stocks.symbol.toUpperCase()})`)
      .setColor(0x9797FF)
      .setFooter('Last Updated')
      .setTimestamp(stocks.lastRefresh)
      .addField('❯ Open', `$${client.formatNumber(stocks.open)}`, true)
      .addField('❯ Close', `$${client.formatNumber(stocks.close)}`, true)
      .addField('❯ Volume', client.formatNumber(stocks.volume), true)
      .addField('❯ High', `$${client.formatNumber(stocks.high)}`, true)
      .addField('❯ Low', `$${client.formatNumber(stocks.low)}`, true)
      .addField('\u200B', '\u200B', true)
    );
  } catch (err) {
    return msg.channel.send(new MessageEmbed()
      .setColor('RED')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`**Stack Trace:**\n\`\`\`${err.stack}\`\`\``)
      .addField('**Command:**', `${msg.content}`)
    );
  }
};

async function fetchStocks(symbol, key) {
  const { body } = await request
    .get('https://www.alphavantage.co/query')
    .query({
      function: 'TIME_SERIES_INTRADAY',
      symbol,
      interval: '1min',
      apikey: key
    });
  if (body['Error Message'] || !body['Time Series (1min)']) return null;
  const data = Object.values(body['Time Series (1min)'])[0];
  return {
    symbol,
    open: data['1. open'],
    high: data['2. high'],
    low: data['3. low'],
    close: data['4. close'],
    volume: data['5. volume'],
    lastRefresh: new Date(body['Meta Data']['3. Last Refreshed'])
  };
}

async function search(query) {
  const { body } = await request
    .get('http://d.yimg.com/autoc.finance.yahoo.com/autoc')
    .query({
      query,
      region: 1,
      lang: 'en'
    });
  if (!body.ResultSet.Result.length) return null;
  return body.ResultSet.Result[0];
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['stonks', 'stonk', 'stock'],
  permLevel: 0
};

exports.help = {
  name: 'stocks',
  description: 'Responds with the current stocks for a company',
  usage: 'stocks [company]'
};

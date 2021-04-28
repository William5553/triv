module.exports = (client, error) => client.logger.error(`An error event was sent by Discord.js: ${JSON.stringify(error)}`);

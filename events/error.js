module.exports = (client, error) => client.logger.error(`An error event was sent by Discord.js:\n${JSON.stringify(error)}`);

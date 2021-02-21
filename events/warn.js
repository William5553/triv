module.exports = async (client, warning) => client.logger.error(`A warn event was sent by Discord.js:\n${JSON.stringify(warning)}`);

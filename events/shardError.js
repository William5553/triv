module.exports = async (client, error) => client.logger.error(`A websocket connection encountered an error:\n${JSON.stringify(error)}`);

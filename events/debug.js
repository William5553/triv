module.exports = (client, msg) => {
  if (process.env.NODE_ENV != 'PRODUCTION')
    client.logger.debug(JSON.stringify(msg));
};
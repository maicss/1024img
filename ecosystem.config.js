module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    {
      name      : 'server',
      script    : 'server.js',
      watch     : ["manager.js"],
    }
  ]
};
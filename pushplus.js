const config = require('./config/config');

module.exports = {
  token: config.pushplus?.token || config.pushplusToken
};

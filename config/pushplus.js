const config = require('./config');
module.exports = {
  token: config.pushplus?.token || config.pushplusToken
};

var path = require('path');
var env = process.env['NODE_ENV'] || 'development';

var config = require(__dirname + '/' + env);

module.exports = config;
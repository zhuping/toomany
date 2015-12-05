/**
 * 用来处理所有的错误
 */

var path = require('path');
var onerror = require('koa-onerror');

module.exports = function(app) {
  var handleConfig = {
    'json': function(err) {
      //返回可读的错误消息
      this.body = {
        ok: false,
        message: err.message
      }
    }
  };
  handleConfig['template'] = path.join(__dirname, '../../public', 'error.html');
  onerror(app, handleConfig);
}
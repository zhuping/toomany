var MODELS = require('../models');
var helper = require('../helper');
var controllerClass = require('../../lib/class.js').controllerClass;

/*
 * 子controller使用ApplicationController.extend来继承
 */
var AppController = controllerClass.extend({
  __filters: ['loginRequired'],
  loginRequired: function*(next) {
    var uid = this.cookies.get('uid');
    var secret = this.cookies.get('secret');
    var user = null;
    var hash = null;

    if (uid && secret) {
      user = yield MODELS.User.findOne({
        where: {
          id: uid
        }
      });
      hash = helper.md5(user.name + helper.loginKey);
    }
    if (secret !== hash) {
      this.body = {
        ok: false,
        message: '请先登录用户'
      };
      return;
    }
    yield next;
  }
});
module.exports = AppController;
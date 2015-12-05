var fs = require('fs');
var path = require('path');
var MODELS = require('../models');
var helper = require('../helper');
var config = require('../../config/');
var AppController = require('./appController');
var thunkify = require('thunkify-wrap').genify;
var _ = require('lodash');
var qn = require('qn');

// 上传七牛
var client = qn.create({
  accessKey: config.accessKey,
  secretKey: config.secretKey,
  bucket: config.bucket,
  domain: config.domain
});
client.upload = thunkify(client.upload);

var User = AppController.extend({
  __skipfilters: {
    signUp: ['loginRequired'],
    signIn: ['loginRequired'],
    uploadImg: ['loginRequired'],
    getAllStars: ['loginRequired'],
    getUserDetail: ['loginRequired']
  },
  setExpires: function() {

    // cookie过期时间设置为 1 天
    var curDate = new Date().getDate();
    var newDate = new Date().setDate(curDate + 1);
    var expires = new Date(newDate);
    return expires;
  },
  uploadImg: function*() {
    var file = this.request.body.files['avatar'];
    var result = yield * client.upload(fs.createReadStream(file.path));
    fs.unlink(file.path);

    this.body = {
      ok: true,
      data: {
        filename: result[0].key
      }
    };
  },
  signUp: function() {
    var me = this;
    return function*() {
      var params = this.request.body;
      var user = null;

      if (params.name && !params.uid) {
        user = yield MODELS.User.findOne({
          where: {
            name: params.name
          }
        });
      }
      if (user) {
        this.body = {
          ok: false,
          message: '对不起，该用户名已被注册'
        };
        return;
      }

      if (params.uid) {
        yield MODELS.User.upsert({
          id: params.uid,
          name: params.name,
          avatar: params.avatar,
          sign: params.sign
        }, {
          fields: ['id', 'name', 'avatar', 'sign']
        });
        user = yield MODELS.User.findById(params.uid);
      } else {
        user = yield MODELS.User.create({
          name: params.name,
          password: helper.md5(params.password),
          avatar: params.avatar,
          sign: params.sign
        });
      }
      this.cookies.set('uid', user.id, {
        'expires': me.setExpires(),
        'httpOnly': false
      });

      // 登录的时候拿来校验用
      var hash = helper.md5(user.name + helper.loginKey);
      this.cookies.set('secret', hash, {
        'expires': me.setExpires(),
        'httpOnly': false
      });

      this.body = {
        ok: true
      }
    }
  },
  signIn: function() {
    var me = this;
    return function*() {
      var params = this.request.body;
      var name = params.name;
      var password = params.password;
      var user = null;

      if (name) {
        user = yield MODELS.User.findOne({
          where: {
            name: name
          }
        });
      }
      if (!user) {
        this.body = {
          ok: false,
          message: '用户名错误'
        };
        return;
      }
      if (password && helper.md5(password) === user.password) {
        this.cookies.set('uid', user.id, {
          'expires': me.setExpires(),
          'httpOnly': false
        });
        var hash = helper.md5(user.name + helper.loginKey);
        this.cookies.set('secret', hash, {
          'expires': me.setExpires(),
          'httpOnly': false
        });

        this.body = {
          ok: true
        };
      } else {
        this.body = {
          ok: false,
          message: '密码错误'
        };
      }
    }
  },
  signOut: function*() {
    var uid = this.cookies.get('uid');
    var secret = this.cookies.get('secret');
    if (uid && secret) {
      this.cookies.set('uid', '', {
        'expires': new Date()
      });
      this.cookies.set('secret', '', {
        'expires': new Date()
      });
      this.redirect('/');
    }
  },
  getLoginUser: function*() {
    var uid = this.cookies.get('uid');
    var user = yield MODELS.User.findOne({
      where: {
        id: uid
      }
    });

    this.body = {
      ok: true,
      data: {
        uid: user.id,
        name: user.name,
        avatar: user.avatar,
        sign: user.sign
      }
    };
  },
  getAllStars: function*() {
    var list = [];

    var users = yield MODELS.User.findAll({
      order: [
        ['albumCount', 'DESC']
      ],
      offset: 0,
      limit: 40,
      where: {
        albumCount: {
          ne: 0
        }
      }
    });

    if (!users) {
      this.body = {
        ok: false,
        message: '查询用户失败'
      };
    } else {
      _.each(users, function(user) {
        user = user.dataValues;
        list.push({
          uid: user.id,
          name: user.name,
          avatar: user.avatar,
          albumCount: user.albumCount
        });
      });
      this.body = {
        ok: true,
        data: {
          list: list
        }
      };
    }
  },
  getUserDetail: function*() {
    var uid = this.query.uid;
    var currentUid = this.cookies.get('uid');
    if (currentUid && !uid) {
      uid = currentUid;
    }

    var user = yield MODELS.User.findOne({
      include: [{
        model: MODELS.Album,
        where: {
          access: 1
        }
      }],
      where: {
        id: uid
      }
    });

    _.each(user.dataValues.Albums, function(album) {
      album.likeCount = album.likeCount === null ? 0 : album.likeCount;
      album.downCount = album.downCount === null ? 0 : album.downCount;
    });

    if (!user) {
      this.body = {
        ok: false,
        message: '查询失败'
      };
    } else {
      this.body = {
        ok: true,
        data: {
          id: user.dataValues.id,
          name: user.dataValues.name,
          avatar: user.dataValues.avatar,
          sign: user.dataValues.sign,
          albums: user.dataValues.Albums
        }
      };
    }
  }
});

module.exports = User;
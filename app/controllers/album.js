var fs = require('fs');
var path = require('path');
var async = require('async');
var request = require('request');
var MODELS = require('../models');
var archiver = require('archiver');
var config = require('../../config/');
var thunkify = require('thunkify-wrap').genify;
var AppController = require('./appController');
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

request = thunkify(request);

var Album = AppController.extend({
  __skipfilters: {
    getAllAlbums: ['loginRequired'],
    getLikeRank: ['loginRequired'],
    getDownRank: ['loginRequired'],
    getArchiver: ['loginRequired']
  },
  requestAlbum: function*(aid, count, start) {
    var dbUrl = 'https://api.douban.com/v2/album/' + aid + '/photos?start=' + start + '&count=' + count;
    var response = yield * request(dbUrl);
    return response[0];
  },
  downloadAlbum: function(photos, id) {
    var me = this;

    fs.exists('./public/download/' + id, function(exists) {
      if (!exists) {
        fs.mkdirSync('./public/download/' + id);
      }

      async.eachLimit(photos, 50, function(photo, callback) {
        if (photo.image) {
          var filename = path.basename(photo.image);
          var filepath = './public/download/' + id + '/' + filename;

          require('request')
            .get(photo.image)
            .on('error', function() {
              console.log(error);
            })
            .pipe(fs.createWriteStream(filepath))
            .on('error', function(err) {
              console.log(err);
            })
            .on('close', function() {
              callback();
            });
        }
      }, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('============== all images have been downloaded. =============');
          me.archiveAlbum(id);
        }
      });
    });
  },
  downloadPoster: function(poster, filepath) {
    return new Promise(function(fulfill, reject) {
      require('request')
        .get(poster)
        .on('error', function(err) {
          reject(err);
        })
        .pipe(fs.createWriteStream(filepath))
        .on('close', function() {
          fulfill();
        });
    });
  },
  archiveAlbum: function(id) {
    var archive = archiver.create('zip');

    return new Promise(function(fulfill, reject) {
      archive.on('error', function(err) {
        reject(err);
      });
      archive
        .pipe(fs.createWriteStream('./public/download/' + id + '.zip'))
        .on('finish', function() {
          fulfill();
        });
      archive.bulk([{
        expand: true,
        cwd: './public/download/' + id + '/',
        src: ['*.jpg']
      }]);
      archive.finalize();
    });
  },
  saveAlbum: function() {
    var me = this;
    return function*() {
      var params = this.request.body;
      var url = params.url.split('%2F');
      var uid = this.cookies.get('uid');
      var aid = url.pop();
      var response = null;
      var count = 100;
      var start = i = 0;
      var total = Infinity;
      var allPhotos = [];

      // 可能是以`/`结尾的url
      aid = aid === '' ? url.pop() : aid;

      // 判断该相册是否已经被上传过
      var album = yield MODELS.Album.findOne({
        where: {
          dbId: aid
        }
      });
      if (album) {
        this.body = {
          ok: false,
          message: '对不起，该相册已经被上传过了'
        };
        return;
      }

      response = yield * request('https://api.douban.com/v2/album/' + aid + '/photos');
      if (response[0].statusCode !== 200) {
        this.body = {
          ok: false,
          message: '请输入有效的豆瓣相册地址'
        };
      }

      // 下载封面
      var body = JSON.parse(response[0].body);
      var poster = body.album.cover.replace('albumcover', 'photo');
      var filepath = './public/uploads/' + path.basename(poster);
      yield me.downloadPoster(poster, filepath);

      var result = yield * client.upload(fs.createReadStream(filepath));
      fs.unlink(filepath);

      // 保存相册信息
      yield MODELS.Album.create({
        title: body.album.title,
        url: body.album.alt,
        poster: result[0].key,
        access: params.access,
        reason: params.reason,
        dbId: body.album.id,
        userId: uid
      });

      // 更新用户上传相册数量
      // 只有设置为公开才统计
      if (params.access === '1') {
        var currentUser = yield MODELS.User.findById(uid);
        yield MODELS.User.upsert({
          id: currentUser.id,
          albumCount: currentUser.albumCount + 1
        }, {
          fields: ['id', 'albumCount']
        });
      }

      this.body = {
        ok: true
      };

      do {
        start = i++ * count;
        response = yield me.requestAlbum(aid, count, start);
        var body = JSON.parse(response.body);
        total = body.total - start;

        // 下载相册
        if (body.photos.length > 0) {
          allPhotos = allPhotos.concat(body.photos);
        } else {
          me.downloadAlbum(allPhotos, body.album.id);
        }

      } while (total / count > 0);
    }
  },
  getAllAlbums: function*() {
    var pageNumber = this.query.pageNumber;
    var page = pageNumber - 1 || 0;
    var limit = this.query.limit || 20;
    var list = [];
    var albums = yield MODELS.Album.findAndCountAll({
      order: [
        ['createdAt', 'DESC']
      ],
      include: [{
        model: MODELS.User
      }],
      offset: page * limit,
      limit: limit,
      where: {
        access: 1
      }
    });

    if (!albums) {
      this.body = {
        ok: false,
        message: '查询失败'
      };
      return;
    }

    _.each(albums.rows, function(album) {
      var user = album.User;
      album = album.dataValues;

      list.push({
        id: album.id,
        title: album.title,
        url: album.url,
        poster: album.poster,
        likeCount: album.likeCount === null ? 0 : album.likeCount,
        downCount: album.downCount === null ? 0 : album.downCount,
        reason: album.reason,
        nickName: user.name,
        avatar: user.avatar,
        uid: user.id
      });
    });

    this.body = {
      ok: true,
      data: {
        list: list,
        totalCount: albums.count,
        limit: limit,
        pageNumber: pageNumber
      }
    };
  },
  getDownRank: function*() {
    var list = [];
    var albums = yield MODELS.Album.findAll({
      order: [
        ['downCount', 'DESC']
      ],
      offset: 0,
      limit: 8,
      where: {
        access: 1
      }
    });
    if (albums) {
      _.each(albums, function(album) {
        album = album.dataValues;
        list.push({
          title: album.title,
          url: album.url,
          downCount: album.downCount === null ? 0 : album.downCount
        });
      });

      this.body = {
        ok: true,
        data: {
          list: list
        }
      };
    } else {
      this.body = {
        ok: false,
        message: '查询下载排行失败'
      };
    }
  },
  getLikeRank: function*() {
    var list = [];
    var albums = yield MODELS.Album.findAll({
      order: [
        ['likeCount', 'DESC']
      ],
      offset: 0,
      limit: 8,
      where: {
        access: 1
      }
    });
    if (albums) {
      _.each(albums, function(album) {
        album = album.dataValues;
        list.push({
          title: album.title,
          url: album.url,
          likeCount: album.likeCount === null ? 0 : album.likeCount
        });
      });

      this.body = {
        ok: true,
        data: {
          list: list
        }
      };
    } else {
      this.body = {
        ok: false,
        message: '查询收藏排行失败'
      };
    }
  },
  getUserAlbum: function*() {
    var list = [];
    var uid = this.cookies.get('uid');
    var albums = yield MODELS.Album.findAll({
      order: [
        ['createdAt', 'DESC']
      ],
      where: {
        userId: uid
      }
    });

    if (!albums) {
      this.body = {
        ok: false,
        message: '查询相册失败'
      };
    } else {
      _.each(albums, function(album) {
        album = album.dataValues;
        album.likeCount = album.likeCount === null ? 0 : album.likeCount;
        album.downCount = album.downCount === null ? 0 : album.downCount;
        list.push(album);
      });

      this.body = {
        ok: true,
        data: {
          list: list
        }
      };
    }
  },
  getUserLike: function*() {
    var list = [];
    var uid = this.cookies.get('uid');
    var albums = yield MODELS.Like.findAll({
      include: [{
        model: MODELS.Album
      }],
      where: {
        userId: uid
      }
    });
    _.each(albums, function(album) {
      album = album.dataValues.Album;
      album.likeCount = album.likeCount === null ? 0 : album.likeCount;
      album.downCount = album.downCount === null ? 0 : album.downCount;
      list.push(album);
    });

    this.body = {
      ok: true,
      data: {
        list: list
      }
    };
  },
  getArchiver: function() {
    var me = this;
    return function*() {
      var albumId = this.query.id;
      var album = yield MODELS.Album.findOne({
        where: {
          id: albumId
        }
      });
      if (!album) {
        this.body = {
          ok: false,
          message: '查询相册失败'
        };
        return;
      }

      var dbId = album.dbId;
      var exists = fs.existsSync('./public/download/' + dbId + '.zip');
      if (!exists) {
        this.throw(500, '手太快啦，图片正在处理中，稍后再试吧。╮(╯_╰)╭');
      }

      // 下载zip文件
      var path = './public/download/' + dbId + '.zip';
      var stats = fs.statSync(path);
      this.set('Last-Modified', stats.mtime.toUTCString());
      this.set('Content-Length', stats.size);
      this.set('Cache-Control', 'max-age=0');
      this.response.attachment(dbId + '.zip');
      this.type = 'application/zip';
      this.body = fs.createReadStream(path);

      // 更新数据库
      yield MODELS.Album.upsert({
        id: albumId,
        downCount: album.downCount + 1
      }, {
        fields: ['id', 'downCount']
      });
    }
  },
  setAlbumLike: function*() {
    var albumId = this.query.id;
    var uid = this.cookies.get('uid');
    var user = yield MODELS.User.findOne({
      where: {
        id: uid
      }
    });

    var album = yield MODELS.Album.findById(albumId);
    var likes = yield MODELS.Like.findAll({
      where: {
        albumId: albumId,
        userId: uid
      }
    });

    if (likes.length === 0) {
      yield MODELS.Like.create({
        albumId: albumId,
        userId: uid
      });

      // 更新收藏数
      yield MODELS.Album.upsert({
        id: albumId,
        likeCount: album.likeCount + 1
      }, {
        fields: ['id', 'likeCount']
      });

      this.body = {
        ok: true
      };
    } else {
      this.body = {
        ok: false,
        message: '你已收藏该相册，请不要重复收藏'
      };
    }
  }
});

module.exports = Album;
define(
  'app/models/album/index', [
    'jquery',
    'app/models/base',
    'underscore',
    'app/exts/tips/index'
  ],
  function($, Base, _, Tips) {
    return Base.extend({
      saveAlbum: function(opts, cb) {
        var me = this;
        me.request().fetchAll([{
          name: 'save_album',
          formParams: opts
        }], function(errs, MesModel) {
          cb && cb();
        });
      },
      getAllAlbums: function(opts, cb) {
        var me = this;
        me.request().fetchAll([{
          name: 'get_all_albums',
          formParams: opts
        }], function(errs, MesModel) {
          var data = MesModel.get('data');
          cb && cb(data);
        });
      },
      getDownRank: function(cb) {
        var me = this;
        me.request().fetchAll([{
          name: 'get_down_rank'
        }], function(errs, MesModel) {
          var data = MesModel.get('data');
          cb && cb(data);
        });
      },
      getLikeRank: function(cb) {
        var me = this;
        me.request().fetchAll([{
          name: 'get_like_rank'
        }], function(errs, MesModel) {
          var data = MesModel.get('data');
          cb && cb(data);
        });
      },
      getUserAlbum: function(cb) {
        var me = this;
        me.request().fetchAll([{
          name: 'get_user_album'
        }], function(errs, MesModel) {
          var data = MesModel.get('data');
          var privateAlbum = [];
          var publicAlbum = [];

          // 处理相册，分类权限
          _.each(data.list, function(album) {
            if (album.access === 1) {
              publicAlbum.push(album);
            } else {
              privateAlbum.push(album);
            }
          });

          cb && cb({
            publicAlbum: publicAlbum,
            privateAlbum: privateAlbum
          });
        });
      },
      setAlbumLike: function(opts, cb) {
        var me = this;
        me.request().fetchAll([{
          name: 'set_album_like',
          formParams: opts
        }], function(errs, MesModel) {
          cb && cb();
        });
      },
      getUserLike: function(cb) {
        var me = this;
        me.request().fetchAll([{
          name: 'get_user_like'
        }], function(errs, MesModel) {
          var data = MesModel.get('data');
          cb && cb(data);
        });
      }
    })
  }
);
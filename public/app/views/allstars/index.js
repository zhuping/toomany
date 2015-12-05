define(
  'app/views/allstars/index', [
    'magix',
    'app/models/user/index',
    'app/models/album/index'
  ],
  function(Magix, UserModel, AlbumModel) {
    return Magix.View.extend({
      init: function() {
        var me = this;
        me.observeLocation(['uid']);
      },
      render: function() {
        var me = this;
        var uid = me.location.get('uid');

        if (!uid) {
          me.wrapModel(UserModel).getAllStars(function(data) {
            me.data = {
              list: data.list,
              showDetail: !!uid
            };
            me.setViewHTML();
          });
        } else {
          me.wrapModel(UserModel).getUserDetail({
            uid: uid
          }, function(data) {
            data.len = data.albums.length;
            me.data = {
              showDetail: !!uid,
              data: data
            };
            me.setViewHTML();
          });
        }
      },
      download: function(e, id) {
        var me = this;
        var curNode = $(e.currentTarget);
        var count = +curNode.find('span').text();

        curNode.find('span').text(count + 1);
      },
      like: function(e, id) {
        var me = this;
        var curNode = $(e.currentTarget);
        var count = +curNode.find('span').text();

        me.wrapModel(AlbumModel).setAlbumLike({
          id: id
        }, function() {
          curNode.find('span').text(count + 1);
        });
      }
    });
  }
);
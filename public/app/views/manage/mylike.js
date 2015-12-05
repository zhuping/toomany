define(
  'app/views/manage/mylike', [
    'magix',
    'app/models/album/index'
  ],
  function(Magix, AlbumModel) {
    return Magix.View.extend({
      render: function() {
        var me = this;
        me.wrapModel(AlbumModel).getUserLike(function(data) {
          me.data = {
            likeAlbum: data.list,
            likeLength: data.list.length
          };
          me.setViewHTML();
        });
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
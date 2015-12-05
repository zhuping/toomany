define(
  'app/views/manage/myupload', [
    'magix',
    'app/models/album/index'
  ],
  function(Magix, AlbumModel) {
    return Magix.View.extend({
      render: function() {
        var me = this;
        me.wrapModel(AlbumModel).getUserAlbum(function(data) {
          me.data = {
            publicAlbum: data.publicAlbum,
            publicLength: data.publicAlbum.length,
            privateAlbum: data.privateAlbum,
            privateLength: data.privateAlbum.length
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
  });
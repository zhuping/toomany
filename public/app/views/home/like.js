define(
  'app/views/home/like', [
    'magix',
    'app/models/album/index'
  ],
  function(Magix, AlbumModel) {
    return Magix.View.extend({
      render: function() {
        var me = this;
        me.wrapModel(AlbumModel).getLikeRank(function(data) {
          me.data = {
            list: data.list
          };
          me.setViewHTML();
        });
      }
    });
  });
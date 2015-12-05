define(
  'app/views/home/download', [
    'magix',
    'app/models/album/index'
  ],
  function(Magix, AlbumModel) {
    return Magix.View.extend({
      render: function() {
        var me = this;
        me.wrapModel(AlbumModel).getDownRank(function(data) {
          me.data = {
            list: data.list
          };
          me.setViewHTML();
        });
      }
    });
  });
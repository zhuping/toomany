define(
  'app/views/manage/upload', [
    'magix',
    'brix/loader',
    'brix/loader/util',
    'app/models/album/index'
  ],
  function(Magix, Loader, _, AlbumModel) {
    return Magix.View.extend({
      init: function(e) {
        var me = this;
        me.callback = e.callback;
      },
      render: function() {
        var me = this;
        me.setViewHTML();
      },
      submit: function(e) {
        var me = this;
        var curNode = $(e.currentTarget);
        var valid = Loader.query($('.upload_form'))[0];
        if (!valid.isValid()) return;

        if (curNode.hasClass('btn-disabled')) return;
        curNode.addClass('btn-disabled');

        var params = _.unparam($('.upload_form').serialize());
        params.reason = decodeURIComponent(params.reason);

        me.wrapModel(AlbumModel).saveAlbum(params, function() {
          curNode.removeClass('btn-disabled');
          me.callback();
        });
      },
      showError: function(error) {
        $('#J_img_msg').text(error).show();
      }
    });
  }
);
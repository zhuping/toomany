define(
  'app/views/home/index', [
    'magix',
    'brix/loader',
    'app/models/album/index'
  ],
  function(Magix, Loader, AlbumModel) {
    return Magix.View.extend({
      init: function() {
        var me = this;
        me.observeLocation(['limit', 'pageNumber']);
      },
      render: function() {
        var me = this;
        var loc = me.location;
        var limit = loc.get('limit') || 20;
        var pageNumber = loc.get('pageNumber') || 1;

        me.wrapModel(AlbumModel).getAllAlbums({
          limit: limit,
          pageNumber: pageNumber
        }, function(data) {
          me.data = {
            list: data.list,
            totalCount: data.totalCount,
            pageNumber: data.pageNumber,
            limit: data.limit
          };
          me.setViewHTML().then(function() {
            me.bindComponents();
          });
        });
      },
      bindComponents: function() {
        var me = this;
        var $ctx = $('#' + me.id);
        var pagination = Loader.query('components/pagination', $ctx)[0];

        // 分页
        if (pagination) {
          pagination.on('change.pagination', function(e, state) {
            me.navigate({
              limit: state.limit,
              pageNumber: state.cursor
            });
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
  });
define(
  'app/views/default', [
    'jquery',
    'underscore',
    'magix'
  ],
  function($, _, Magix) {
    return Magix.View.extend({
      init: function() {
        var me = this;
        me.observeLocation({
          path: true
        });
      },
      render: function(e) {
        var me = this;

        me.setViewHTML();
        me.mountVframes();
      },
      mountVframes: function() {
        window.scrollTo(0, 0);
        var me = this;
        var vom = me.vom;
        var loc = me.location;
        var pn = loc.path;
        var mainVframe = vom.get('magix_vf_main');

        if (mainVframe) {
          var view = pn.substring(1);
          mainVframe.mountView('app/views/' + view);
        }
      }
    });
  }
);
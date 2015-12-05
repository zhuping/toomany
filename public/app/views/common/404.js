define(
  'app/views/common/404', [
    'magix'
  ],
  function(Magix) {
    return Magix.View.extend({
      render: function() {
        var me = this;
        me.setViewHTML();
      },
      goBack: function(e) {
        e.preventDefault();
        history.back();
      }
    });
  });
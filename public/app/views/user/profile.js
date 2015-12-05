define(
  'app/views/user/profile', [
    'magix'
  ],
  function(Magix) {
    return Magix.View.extend({
      render: function() {
        var me = this;
        var uid = me.location.get('uid');

        me.setViewHTML().then(function() {
          me.owner.mountVframe('J_profile_view', 'app/views/user/signup', {
            uid: uid
          });
        });
      }
    });
  });
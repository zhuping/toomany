define(
  'app/views/user/signin', [
    'magix',
    'brix/loader',
    'brix/loader/util',
    'app/models/user/index'
  ],
  function(Magix, Loader, _, UserModel) {
    return Magix.View.extend({
      render: function() {
        var me = this;
        me.setViewHTML();
      },
      submit: function() {
        var me = this;
        var valid = Loader.query($('.signin_form'))[0];
        if (!valid.isValid()) {
          return false;
        }
        var params = _.unparam($('.signin_form').serialize());
        params.name = decodeURIComponent(params.name);

        me.wrapModel(UserModel).signInUser(params, function() {
          window.location.href = '/';
        });
      }
    });
  });
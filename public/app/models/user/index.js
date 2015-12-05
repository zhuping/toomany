define(
  'app/models/user/index', [
    'jquery',
    'app/models/base',
    'underscore',
    'app/exts/tips/index'
  ],
  function($, Base, _, Tips) {
    return Base.extend({
      signUpUser: function(opts, cb) {
        var me = this;
        me.request().fetchAll([{
          name: 'user_signup',
          formParams: opts
        }], function(errs, MesModel) {
          var data = MesModel.get('data');
          cb && cb(data);
        });
      },
      signInUser: function(opts, cb) {
        var me = this;
        me.request().fetchAll([{
          name: 'user_signin',
          formParams: opts
        }], function(errs, MesModel) {
          var data = MesModel.get('data');
          cb && cb(data);
        });
      },
      getLoginUser: function(cb) {
        var me = this;
        me.request().fetchAll([{
          name: 'get_login_user'
        }], function(errs, MesModel) {
          var data = MesModel.get('data');
          cb && cb(data);
        });
      },
      getAllStars: function(cb) {
        var me = this;
        me.request().fetchAll([{
          name: 'get_all_stars'
        }], function(errs, MesModel) {
          var data = MesModel.get('data');
          cb && cb(data);
        });
      },
      getUserDetail: function(opts, cb) {
        var me = this;
        me.request().fetchAll([{
          name: 'get_user_detail',
          formParams: opts
        }], function(errs, MesModel) {
          var data = MesModel.get('data');
          cb && cb(data);
        });
      }
    })
  }
);
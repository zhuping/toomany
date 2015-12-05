define(
  'app/views/common/header', [
    'jquery',
    'brix/loader/util',
    'magix',
    'app/exts/cookie/index',
    'app/models/user/index'
  ],
  function($, _, Magix, Cookie, UserModel) {
    var EMPTY = '';
    var MENU_LIST = [{
      path: '/home/index',
      text: '首页'
    }, {
      path: '/manage/index',
      text: '相册管理'
    }, {
      path: '/allstars/index',
      text: '明星榜'
    }];

    return Magix.View.extend({
      init: function() {
        var me = this;
        me.observeLocation({
          path: true
        });
      },
      render: function() {
        var me = this;
        var uid = Cookie.get('uid');
        var menuList = $.extend(true, [], MENU_LIST);
        menuList = me.wrapNav(menuList);
        me.data = {
          menuList: menuList
        };

        if (uid) {
          me.wrapModel(UserModel).getLoginUser(function(data) {
            _.extend(me.data, {
              loginUser: data
            });
            me.setViewHTML();
          });
          return;
        }

        me.setViewHTML();
      },
      wrapNav: function(menuList) {
        var me = this;
        var path = me.location.path || EMPTY;
        var i, menu;
        for (i = 0;
          (menu = menuList[i]) !== undefined; i++) {
          if (!path.indexOf('/' + menu.path.substr(1).split('/')[0])) {
            menu.active = true;
            break;
          }
        }
        if (!menu) {
          menuList[0].active = true;
        }

        return menuList;
      }
    });
  });
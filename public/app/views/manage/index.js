define(
  'app/views/manage/index', [
    'magix',
    'app/util/dialog/index',
    'components/dialog/position',
    'app/models/user/index'
  ],
  function(Magix, DialogHelper, DialogPosition, UserModel) {
    var DEFAULT_TAB = 'myupload';
    var DEFAULT_TABS = [{
      tab: 'myupload',
      name: '我的上传'
    }, {
      tab: 'mylike',
      name: '我的收藏'
    }];

    return Magix.View.extend({
      init: function() {
        var me = this;
        me.observeLocation(['tab']);

        me.on('destroy', function() {
          DialogHelper.hideDialog();
        });
      },
      render: function() {
        var me = this;
        var loc = me.location;
        var tab = loc.get('tab') || DEFAULT_TAB;
        var tabs = me.wrapTabs(DEFAULT_TABS, tab);

        me.wrapModel(UserModel).getLoginUser(function(data) {
          me.data = {
            data: data,
            tabs: tabs
          };
          me.setViewHTML().then(function() {
            me.mountTabView(tab);
          });
        });
      },
      mountTabView: function(tab) {
        var me = this;
        me.owner.mountVframe('J_manage_View', 'app/views/manage/' + tab);
      },
      wrapTabs: function(tabs, currentTab) {
        _.each(tabs, function(item, i) {
          if (currentTab === item.tab) {
            item.selected = true;
          } else {
            item.selected = false;
          }
        });
        return tabs;
      },
      toggleTab: function(e, tab) {
        var me = this;
        var curNode = $(e.currentTarget);
        if (curNode.hasClass('select')) {
          return;
        }
        me.navigate({
          tab: tab
        });
      },
      upload: function() {
        var me = this;
        var w = 650;
        var winHeight = $(window).height();
        var h = winHeight - 40;
        var offset = DialogPosition.center(w, h);
        var dialogOptions = {
          width: w,
          height: h,
          left: offset.left,
          top: offset.top,
          modal: true
        };
        var viewOptions = {
          callback: function() {
            me.render();
            DialogHelper.hideDialog();
          }
        };
        var viewName = 'app/views/manage/upload';
        DialogHelper.showDialog(dialogOptions, viewName, viewOptions);
      }
    });
  }
);
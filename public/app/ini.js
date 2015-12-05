define(
  'app/ini', [
    'jquery'
  ],
  function($) {
    var MainView = 'app/views/default'
    var T = {
      routes: {
        'app/views/default': [
          // 首页
          '/home/index',

          // 名人堂
          '/allstars/index',

          // 相册管理
          '/manage/index',

          // 注册页面
          '/user/signup',

          // 登录页面
          '/user/signin',

          // 个人信息页
          '/user/profile'
        ]
      }
    }
    return {
      defaultView: MainView,
      defaultPath: '/home/index',
      unfoundView: 'app/views/common/404',
      tagName: 'div',
      extensions: [
        'app/brix', //扩展view提供brix的pagelet自动初始化组件，并跟数据结合渲染页面
        'app/view'
      ],
      routes: function(pathname) {
        if (!$.isEmptyObject(T.routes)) {
          var s
          $.each(T.routes, function(k, item) {
            if ($.inArray(pathname, item) !== -1) {
              s = k
              return false
            }
          })
          if (s) return s
          return this.unfoundView
        }
        return this.defaultView
      },
      error: function(e) {
        if (window.JSTracker) {
          window.JSTracker.error(e.message)
        } else if (window.console) {
          window.console.error(e.stack)
        }
      }
    }
  }
)
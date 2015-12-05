define(
  [
    'jquery',
    'underscore',
    'magix',
    'app/exts/tips/index'
  ],
  function(
    $, _, Magix, Tips
  ) {
    // body...
    var DEFAULT = {
      ajaxSetting: {
        method: 'GET',
        dataType: 'json'
      }
    };

    return Magix.Model.extend({
      sync: function(callback) {
        var me = this;
        var ajaxSetting = DEFAULT.ajaxSetting;
        var formParams = me.getFormParams();
        var urlParams = me.getUrlParams();
        var url = me.get('url');
        //加上同步请求方式
        var async = me.get('async');
        var method = me.get('method') || ajaxSetting.method;
        var dataType = me.get('dataType') || ajaxSetting.dataType;

        async = async === false ? false : true;

        // 针对IE9一下浏览器缓存机制去除cache的影响
        $.extend(formParams, {
          t: (+new Date())
        });

        //magix的请求json全局接口加上csrfID
        // $.extend(formParams, {
        //   _page_csrf_token: UserInfo.csrfToken
        // });

        $.ajax({
          // 转换成字符串路径
          url: Magix.toUrl(url, urlParams),
          dataType: dataType,
          data: formParams,
          type: method,
          async: async,
          success: function(data, status, xhr) {
            if (!data.ok) {
              Tips.show({
                content: data.message,
                zIndex: 1040
              });
            } else {
              callback(null, data);
            }
          },
          error: function(xhr, msg) {
            // 没权限跳回登录页
            if (xhr.status === 403) {
              location.href = UserInfo.loginUrl
            }
            callback(msg);
          }
        });
      }
    });
  }
);
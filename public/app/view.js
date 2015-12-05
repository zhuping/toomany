define(
  'app/view', 
  [
    'jquery',
    'handlebars',
    'magix',
    'brix/loader',
    'app/models/manager'
  ],
  function($, Handlebars, Magix, Loader, Manager) {
    // 扩展Handlebars
    // if等于判断
    Handlebars.registerHelper('ifCond', function(v1, v2, options) {
      return (v1.valueOf() === v2) ? options.fn(this) : options.inverse(this)
    })
    // checkbox checked 判断
    Handlebars.registerHelper('checked', function(v1, v2, options) {
      return (v1.valueOf() === v2) ? ' checked="checked"' : '';
    })

    return Magix.View.mixin({
      request: function() {
        return Manager.createRequest(this)
      },
      wrapModel: function(Model) {
        return new Model(this)
      },
      setViewHTML: function(data) {
        var me = this
        var defer = $.Deferred()
        var promise = defer.promise()
        var $wrapper = $('#' + me.id)
        var sign = me.sign

        data = data || me.data
        if (!me.__tmplFn__) {
          me.__tmplFn__ = Handlebars.compile(me.tmpl)
        }
        Loader.destroy($wrapper[0])
        //加上renderer处理
        if (me.renderers) {
          me.registerRenderers(me.renderers)
        }

        me.setHTML(me.id, me.__tmplFn__(data))

        Loader.boot($wrapper[0], function() {
          if (sign == me.sign) {
            defer.resolve(Loader)
          }
        })

        return promise
      },
      /**
       * 注册模板帮助方法
       * @param {object} data 包含方法的对象
       **/
      registerRenderers: function(data) {
        data = data || {}
        var me = this
        var ret = {}
        for (var group in data) {
          var groups = data[group]
          for (var n in groups) {
            /*jshint -W083*/
            ret[group + '_' + n] = (function(f) {
              return function() {
                return f.call(this, me)
              }
            }(groups[n]))
          }
        }
        return $.extend(me.data, ret)
      }
    })
  }
)
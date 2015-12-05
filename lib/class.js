// 参考：http://ejohn.org/blog/simple-javascript-inheritance/

var _ = require('lodash');

var ClassFactory = function(obj) {
  obj = obj || {};

  var _mix = function(r, s) {
    for (var p in s) {
      if (s.hasOwnProperty(p)) {
        r[p] = obj[p] ? obj[p](r, s, p) : s[p];
      }
    }
  }

  var _extend = function() {
      var prototype = new this();
      var items = Array.prototype.slice.call(arguments) || [];
      var item;

      //支持混入多个属性，并且支持{}也支持 Function
      while (item = items.shift()) {
        _mix(prototype, item.prototype || item);
      }

      // 这边是返回的类，其实就是我们返回的子类
      function SubClass() {}
      // 赋值原型链，完成继承
      SubClass.prototype = prototype;
      // 改变constructor引用
      SubClass.prototype.constructor = SubClass;

      // 为子类也添加extend方法
      SubClass.extend = _extend;
      return SubClass;
    }
    //超级父类
  var Class = function() {}
    //为超级父类添加extend方法
  Class.extend = _extend;

  return Class;
}

//往上追溯一级合并数据
var _walkConcat = function(source, extend, key) {
  var sourceValue = source.constructor.prototype[key] || [];
  var extendValue = extend[key] || [];
  return sourceValue.concat(extendValue);
}

//所有controller的父类
exports.controllerClass = ClassFactory({
  __filters: _walkConcat,
  extend: function(source) {
    console.info('should not overwrite extend in controller...')
    return source;
  }
})
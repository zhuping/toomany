var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var routers = require('koa-router')();
var ROUTE = require('./config.js');

var cache = {};
var controllerDir = path.join(__dirname, '../controllers');

function isGeneratorFunction(obj) {
  return obj && obj.constructor && 'GeneratorFunction' == obj.constructor.name;
}

function _normalizeFilters(controllerName, actionName) {
  var filters = [];
  var controller = cache[controllerName];
  var config = {};
  var curMethod;
  var skipfilters = controller.__skipfilters || {};

  //组装filters
  controller.__filters.forEach(function(options) {
    config = _.isString(options) ? {
      name: options
    } : options;

    //可以被跳过去
    if (_.indexOf(skipfilters[actionName], config.name) !== -1) return;

    //不是object说明不对，忽略
    if (!_.isObject(config)) return;

    //如果是 有白名单的filter 并且不在白名单里  就忽略
    if (config.only && _.indexOf(config.only, actionName) === -1) return;
    
    curMethod = controller[config.name];
    isGeneratorFunction(curMethod) ? filters.push(curMethod) : filters.push(curMethod.call(controller));
  })
  return filters
}

function _normalizeAction(controllerName, actionName) {
  var controller = cache[controllerName];

  if (!controller[actionName]) return;

  if (isGeneratorFunction(controller[actionName])) return controller[actionName];
  return controller[actionName].call(controller);
}

module.exports = function(app) {
  app.use(routers.routes())
    .use(routers.allowedMethods());

  fs.readdirSync(controllerDir)
    .filter(function(file) {
      return (file.indexOf('.') !== 0);
    })
    .forEach(function(file) {
      var ControllerClass = require(path.join(controllerDir, file));
      cache[path.basename(file, '.js')] = new ControllerClass();
    })

  ROUTE.forEach(function(router) {
    var args = [router.url];
    var controllerName = router.controller.split('.')[0];
    var actionName = router.controller.split('.')[1];

    //组装filters,renderers等等
    if (_.isArray(cache[controllerName].__filters)) {
      args = args.concat(_normalizeFilters(controllerName, actionName))
    }

    //添加middlewave
    var middlewave = _normalizeAction(controllerName, actionName);
    if (middlewave) {
      args.push(middlewave);
      routers[router.type].apply(routers, args);
    }
  })
}
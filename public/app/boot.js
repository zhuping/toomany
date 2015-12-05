(function() {
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }();

  /*var base = function() {
    var src = script.getAttribute('src')
    var base = /(.+\/)(.+\/.+)/.exec(src)[1]
    return base
  }();*/

  require.config({
    paths: {
      app: 'app/',
      magix: '//g.alicdn.com/thx/magix/2.0/requirejs-magix'
    }
  });

  require(['magix'], function(Magix) {
    Magix.start({
      error: function(e) {
        if (console) {
          console.error(e.stack) //将错误抛出来
        }
      },
      iniFile: 'app/ini' //配置在ini.js里
    });
  })
})()
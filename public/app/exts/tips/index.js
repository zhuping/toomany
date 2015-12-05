define(
  [
    'jquery',
    'underscore',
    'css!app/exts/tips/index.css'
  ],
  function(
    $, _
  ) {
    // body...
    /*jshint unused: false*/
    var EMPTY = '';
    var GUID = [$.expando, 'tips'].join('_');

    var Cfg = {
      autoHide: true,
      content: EMPTY,
      delay: 2000,
      closeable: true,
      type: 'error'
    };

    var HiddenTimer;

    /*jshint multistr:true*/
    var TMPL =
      '\
      <div class="<%= type %>">\
        <% if (type === "error") { %>\
          <i class="icon tmfont">&#xe603;</i>\
        <% } else if (type === "ok") { %>\
          <i class="icon tmfont">&#xe605;</i>\
        <% }%>\
        <span class="text"><%= content%></span>\
        <% if (closeable) { %>\
          <div class="close cp"><i class="tmfont">&#xe604;</i></div>\
        <% } %>\
      </div>\
    ';

    function show(cfg) {
      cfg = $.extend(true, {}, Cfg, cfg);
      var callback = cfg.callback;
      var delay = cfg.delay;
      var autoHide = cfg.autoHide;
      var $tips = $('#' + GUID);
      delay = $.isNumeric(delay) ? +delay : Cfg.delay;

      if (!$tips.length) {
        $('<div id="' + GUID + '" class="bx-global-tips"></div>').appendTo(document.body);
        $tips = $('#' + GUID);
      }

      function __show() {
        var html = _.template(TMPL)(cfg);
        $tips.hide();
        $tips.html(html);
        $tips.find('.close')
          .off()
          .on('click', function() {
            hide();
          });
        if ($.isNumeric(cfg.zIndex)) {
          $tips.css('zIndex', +cfg.zIndex);
        }
        $tips.slideDown(250);
      }

      if (HiddenTimer) {
        clearTimeout(HiddenTimer);
      }

      if (autoHide) {
        HiddenTimer = setTimeout(function() {
          hide();
        }, delay);
      }

      __show();
    }

    function hide() {
      var $tips = $('#' + GUID);
      $tips.slideUp(250, function() {
        $tips.remove();
      });
      clearTimeout(HiddenTimer);
    }

    return {
      show: show,
      hide: hide
    };

  }
);
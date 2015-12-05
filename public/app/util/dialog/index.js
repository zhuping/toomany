define(
  'app/util/dialog/index', [
    'jquery',
    'magix',
    'underscore',
    'components/dialog'
  ],
  function($, Magix, _, DialogView) {
    var Helpers = {
      globalDialog: null,
      /**
       * 全局唯一的dialog
       * @param  {object} dialogOptions 配置项
       * @param  {string} viewName      view地址
       * @param  {object} viewOptions   传递给view的参数
       * @return {object}               全局dialog的实例
       */
      showDialog: function(dialogOptions, viewName, viewOptions) {
        var globalDialogId = 'J_global_dialog';

        var options = {
          content: '<div class="block-dialog" id="' + globalDialogId + '"></div>',
          width: 300,
          modal: true,
          element: $("#magix_vf_main"),
          align: 'left',
          placement: 'top',
          offset: {
            left: 0,
            top: 0
          }
        };

        $.extend(options, dialogOptions);
        if (!options.left) options.left = options.element.offset().left;
        if (!options.top) options.top = options.element.offset().top;
        /* jshint -W030 */
        this.globalDialog && this.globalDialog.destroy();

        var rootVf = Magix.Vframe.root();
        rootVf.unmountVframe(globalDialogId);

        var dialog = new DialogView(options);
        viewOptions = viewOptions || {};
        var closed = viewOptions.closed || function() {};
        dialog.on('open.dialog', function(e) {
          rootVf.mountVframe(globalDialogId, viewName, viewOptions);
        });

        dialog.on('close.dialog', function() {
          //需要加个延时，不然dialog组件里没类容就没高度了，囧
          //dialog组件里是150毫秒，所以这里弄成200毫秒
          setTimeout(function() {
            rootVf.unmountVframe(globalDialogId);
          }, 200);
          closed && closed();
        })
        this.globalDialog = dialog;
        this.globalDialog.open();

        return dialog;
      },
      hideDialog: function() {
        if (this.globalDialog) {
          this.globalDialog.close();
        }
      }
    };
    return Helpers;
  }
);
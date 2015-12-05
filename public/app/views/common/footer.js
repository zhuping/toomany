define(
  'app/views/common/footer', [
    'jquery',
    'magix'
  ],
  function($, Magix) {
    return Magix.View.extend({
      render: function() {
        this.setViewHTML()
      }
    })
  }
)
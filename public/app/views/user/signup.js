define(
  'app/views/user/signup', [
    'magix',
    'brix/loader',
    'brix/loader/util',
    'app/models/user/index'
  ],
  function(Magix, Loader, _, UserModel) {
    return Magix.View.extend({
      init: function(e) {
        var me = this;
        me.uid = e.uid;
        me.data.isModify = !!e.uid;
      },
      render: function() {
        var me = this;
        var isModify = me.data.isModify;

        if (isModify) {
          me.wrapModel(UserModel).getLoginUser(function(data) {
            _.extend(me.data, data);
            me.setViewHTML();
          });
        } else {
          me.setViewHTML();
        }
      },
      upload: function(e) {
        var me = this;
        var file = e.target.files && e.target.files[0];
        if (!file.type.match('image.*')) {
          me.showError('请上传图片文件。');
          return;
        }
        if (file.size / 1024 > 500) {
          me.showError('图片大于500kb。');
          return;
        }
        $('#J_img_msg').hide();

        var reader = new FileReader();
        reader.onload = (function(f) {
          return function(e) {
            $('.preview img').attr('src', e.target.result).parent('.preview').show();
            me.xhr(file);
          }
        })(file);
        reader.readAsDataURL(file);
      },
      xhr: function(file) {
        var me = this;
        var data = new FormData();
        data.append('avatar', file);

        $.ajax({
          url: '/api/user/uploadImg',
          type: 'post',
          data: data,
          processData: false,
          contentType: false,
          success: function(resp) {
            if (!resp.ok) {
              me.showError(resp.message);
            } else {
              me.data.avatar = resp.data.filename
            }
          }
        });
      },
      submit: function() {
        var me = this;
        var valid = Loader.query($('.signup_form'))[0];
        if (!valid.isValid()) {
          return false;
        }

        // 验证图片
        if (!me.data.avatar) {
          me.showError('请上传图片文件。');
          return;
        }

        var params = _.extend({
          avatar: me.data.avatar
        }, _.unparam($('.signup_form').serialize()));
        params.name = decodeURIComponent(params.name);
        params.sign = decodeURIComponent(params.sign);

        if (me.data.isModify) {
          params.uid = me.uid;
        }

        me.wrapModel(UserModel).signUpUser(params, function() {
          // 注册成功，跳转首页
          window.location.href = '/';
        });
      },
      showError: function(error) {
        $('#J_img_msg').text(error).show();
      }
    });
  });
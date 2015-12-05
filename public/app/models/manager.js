define(
  [
    'app/models/model',
    'magix'
  ],
  function(Model, Magix) {
    var M = Magix.Manager.create(Model);

    M.registerModels([
      // 注册用户
      {
        name: 'user_signup',
        url: '/api/user/signUp',
        method: 'post'
      },
      // 获取登录用户信息
      {
        name: 'get_login_user',
        url: '/api/user/getLoginUser'
      },
      // 登录
      {
        name: 'user_signin',
        url: '/api/user/signIn',
        method: 'post'
      },
      // 上传相册
      {
        name: 'save_album',
        url: '/api/album/saveAlbum',
        method: 'post'
      },
      // 获取相册列表
      {
        name: 'get_all_albums',
        url: '/api/album/getAllAlbums'
      },
      // 获取下载排行
      {
        name: 'get_down_rank',
        url: '/api/album/getDownRank'
      },
      // 获取收藏排行
      {
        name: 'get_like_rank',
        url: '/api/album/getLikeRank'
      },
      // 获取明星榜
      {
        name: 'get_all_stars',
        url: '/api/user/getAllStars'
      },
      // 获取用户详情
      {
        name: 'get_user_detail',
        url: '/api/user/getUserDetail'
      },
      // 获取用户相册
      {
        name: 'get_user_album',
        url: '/api/album/getUserAlbum'
      },
      // 收藏相册
      {
        name: 'set_album_like',
        url: '/api/album/setAlbumLike'
      },
      // 获取用户收藏
      {
        name: 'get_user_like',
        url: '/api/album/getUserLike'
      }
    ]);

    return M;
  });
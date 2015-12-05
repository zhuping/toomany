/**
 * 配置所有的路由
 * @type string        请求的类型 eg.all|get|post|put
 * @controller string  请求对应的控制器  以.号分割 eg.welcome.index
 * @url string         请求的地址
 */

// user
var ROUTE = [{
  type: 'post',
  controller: 'user.signUp',
  url: '/api/user/signUp'
}, {
  type: 'post',
  controller: 'user.uploadImg',
  url: '/api/user/uploadImg'
}, {
  type: 'get',
  controller: 'user.getLoginUser',
  url: '/api/user/getLoginUser'
}, {
  type: 'get',
  controller: 'user.signOut',
  url: '/api/user/signOut'
}, {
  type: 'post',
  controller: 'user.signIn',
  url: '/api/user/signIn'
}, {
  type: 'get',
  controller: 'user.getAllStars',
  url: '/api/user/getAllStars'
}, {
  type: 'get',
  controller: 'user.getUserDetail',
  url: '/api/user/getUserDetail'
}];

// album
ROUTE = ROUTE.concat([{
  type: 'post',
  controller: 'album.saveAlbum',
  url: '/api/album/saveAlbum'
}, {
  type: 'get',
  controller: 'album.getAllAlbums',
  url: '/api/album/getAllAlbums'
}, {
  type: 'get',
  controller: 'album.getDownRank',
  url: '/api/album/getDownRank'
}, {
  type: 'get',
  controller: 'album.getLikeRank',
  url: '/api/album/getLikeRank'
}, {
  type: 'get',
  controller: 'album.getUserAlbum',
  url: '/api/album/getUserAlbum'
}, {
  type: 'get',
  controller: 'album.getArchiver',
  url: '/api/album/getArchiver'
}, {
  type: 'get',
  controller: 'album.setAlbumLike',
  url: '/api/album/setAlbumLike'
}, {
  type: 'get',
  controller: 'album.getUserLike',
  url: '/api/album/getUserLike'
}]);

module.exports = ROUTE;
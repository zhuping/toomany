var gulp = require('gulp');
var less = require('gulp-less');
var postcss = require('gulp-postcss');
var nodemon = require('gulp-nodemon');
var autoprefixer = require('autoprefixer');
var exec = require('child_process').exec;

gulp.task('less', function() {
  return gulp.src('./public/app/assets/index.less')
    .pipe(less({}))
    .pipe(postcss([
      autoprefixer({
        browsers: ['last 1 version']
      })
    ]))
    .pipe(gulp.dest('./public/app/assets/'));
});

gulp.task('watch', function() {
  gulp.watch(['./public/app/assets/**/*.less'], ['less']);
});

gulp.task('develop', function() {
  var nodeArgs = ['--harmony'];
  if (gulp.env.debug) {
    nodeArgs.push('--debug')
  }
  nodemon({
      script: 'server.js',
      ext: 'html js',
      ignore: ['node_modules/*'],
      nodeArgs: nodeArgs,
      env: {
        'NODE_ENV': 'development'
      }
    })
    .on('restart', function() {
      console.log('restarted!')
    });
});

//开发时使用
gulp.task('default', [
  'less',
  'develop',
  'watch'
]);

//封装，调用sequelize
var sequelizeCall = function(_cmd, cb) {
  var cmd = './node_modules/sequelize-cli/bin/sequelize ' + _cmd
  var result = exec(cmd, {
    maxBuffer: 1024 * 1024
  })
  result.stdout.on('data', function(data) {
    console.log(data.toString())
  });

  result.stderr.on('data', function(data) {
    console.log(data.toString())
  });

  result.on('close', function(code) {
    cb()
  });
}

/**
 * 生成一个新的数据库migrations文件，会自动放到db/migrations下面
 * @param {string} name migration的名字 eg. add_index_to_user
 *
 * example gulp migrate:new --name add_index_to_user
 */

var migrateName = gulp.env.name || 'unname';
gulp.task('migrate:new', function(cb) {
  var cmd = 'migration:create --name ' + migrateName
  sequelizeCall(cmd, cb)
});

/**
 * 运行数据库migration,注意这个一般是本地开发时使用，线上会在发布任务里调用
 * example gulp migrate:exec
 */

gulp.task('migrate:exec', function(cb) {
  //只会改测试数据库
  var cmd = 'db:migrate --env development'
  sequelizeCall(cmd, cb)
})

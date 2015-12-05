var koa = require('koa');
var path = require('path');
var csrf = require('koa-csrf');
var koaBody = require('koa-body');
var statics = require('koa-static');
var session = require('koa-session');
var router = require('./app/router/');
var logRecord = require('koa-logs-full');
var error = require('./app/helper/error');
var bodyParser = require('koa-bodyparser');

var app = module.exports = koa();

// app.keys = ['toomany secret'];
// app.use(session(app));

// 上传图片
app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, 'public/uploads'),
    maxFieldsSize: 500,
    keepExtensions: true
  }
}));
app.use(bodyParser());
// app.use(csrf());
app.use(statics(path.join(__dirname, 'public')));

//logger inject
app.use(logRecord(app, {
  logdir: path.join(__dirname, 'logs'),
  showError: true,
  exportGlobalLogger: true
}));

//error handel
error(app);

router(app);
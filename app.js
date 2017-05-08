const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const co = require('co');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');
const multer  = require('multer');
const uploader = multer({ dest: 'uploads/' });
const fs = require('fs');
const path = require('path');
const StringDecoder = require('string_decoder').StringDecoder
const EventEmitter = require('events').EventEmitter
const util = require('util');
const formidable = require('formidable');



const index = require('./routes/index');
const users = require('./routes/users');
const upload = require('./routes/upload');
const up = require('./routes/up');
// middlewares
app.use(convert(bodyparser));

app.use(convert(json()));
app.use(convert(logger()));
app.use(require('koa-static')(__dirname + '/public'));
// app.use(views(__dirname + '/views', {
//   extension: 'jade'
// }));
app.use(views('views'), { map: { html: 'ejs' } });

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

router.use('/index', index.routes(), index.allowedMethods());

router.use('/users', users.routes(), users.allowedMethods());
router.use('/upload', upload.routes(), upload.allowedMethods());
router.use('/up', up.routes(), up.allowedMethods());

app.use(router.routes(), router.allowedMethods());
// console.log(router);
// response

app.on('error', function(err, ctx){
  console.log(err)
  logger.error('server error', err, ctx);
});


module.exports = app;
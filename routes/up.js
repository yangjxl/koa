var router = require('koa-router')();
var request = require('request');

router
  .get('/', async function (ctx, next) {
    await ctx.render('up');
  })
  .post('/upload', async function (ctx){
    const imgPath = ctx.request.body.imgPath;
    console.log(imgPath);
    const result = await request({
      method: 'post',
      uri: ``,
      body: imgPath,
      json: true
    });
    ctx.body = result;
  });

module.exports = router;
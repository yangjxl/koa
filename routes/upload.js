var router = require('koa-router')();
var request = require('request');

router
  .get('/', async function (ctx, next) {
    await ctx.render('upload');
  })
  .post('/upload', async function (ctx, next) {
    const accountImg = ctx.request.body.aaaa;
    console.log(accountImg);
    const userArray = await request({
      method: 'POST',
      uri: `http://192.168.16.176:9888/account/saveImg`,
      body: {accountImg},
      json: true
    })
    ctx.body = userArray;
  });

module.exports = router;

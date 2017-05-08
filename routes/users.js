var router = require('koa-router')();
var request = require('request');

router
  .get('/', async function (ctx, next) {
    await ctx.render('users');
  })
  .post('/pageSearch', async function (ctx, next) {
    const data = {};
    // data.array = ctx.request.body.array;
    data.pageSize = ctx.request.body.pageSize;
    data.pageIndex = ctx.request.body.pageNum - 1;
    // data.accountOriginalId = ctx.request.body.accountOriginalId;
    // console.log(data);
    const resData = await request({
      method: 'post',
      uri: `http://192.168.16.176:9888/account/pageAccount`,
      body:data,
      json: true
    });
    console.log(resData);
    ctx.body = resData;
  });
module.exports = router;

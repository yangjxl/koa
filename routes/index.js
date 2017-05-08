var router = require('koa-router')();
var request = require('request');

router
  .get('/', async function (ctx, next) {
    await ctx.render('index');
  })
  .get('/add', async function (ctx, next) {
    await ctx.render('add');
  })
  .get('/edit', async function (ctx, next) {
    await ctx.render('edit');
  })
  .get('/search', async function (ctx, next) {
    const resData = await request({
      method: 'GET',
      uri: `http://192.168.16.176:9888/account/allAccount`,
      json: true
    });
    ctx.body = resData;
  })
//   .get('/searchAccountId', async function (ctx, next) {
//   const id = ctx.query.id;
//   // const id = '90002';
//   const resData = await request({
//     method: 'GET',
//     uri: `http://192.168.16.176:9888/account/accountId/${id}`,
//     json: true
//   });
//   console.log(resData);
//   ctx.body = resData;
// })
// .get('/searchOriginalId', async function (ctx, next) {
//   const id = ctx.query.id;
//   const resData = await request({
//     method: 'GET',
//     uri: `http://192.168.16.176:9888/account/accountOriginalId/${id}`,
//     json: true
//   });
//   console.log(resData);
//   ctx.body = resData;
// })
.get('/id', async function (ctx, next) {
  const id = ctx.query.id;
  console.log(id);
  const resData = await request({
    method: 'GET',
    uri: `http://192.168.16.176:9888/account/id/${id}`,
    json: true
  });
  console.log(resData);
  ctx.body = resData;
})
.get('/searchChannelId', async function (ctx, next) {
  const id = ctx.query.id;
  console.log(id);
  const resData = await request({
    method: 'GET',
    uri: `http://192.168.16.176:9888/account/channelId/${id}`,
    json: true
  });
  console.log(resData);
  ctx.body = resData;
})
.get('/searchBusinessType', async function (ctx, next) {
  const id = ctx.query.id;
  console.log(id);
  const resData = await request({
    method: 'GET',
    uri: `http://192.168.16.176:9888/account/appId/${id}`,
    json: true
  });
  console.log(resData);
  ctx.body = resData;
})
 .post('/save', async function (ctx, next) {
    const array = ctx.request.body.array;
    const userArray = await request({
      method: 'POST',
      uri: `http://192.168.16.176:9888/account/saveAccount`,
      body: array,
      json: true
    });
    console.log(userArray);
    ctx.body = userArray;
  })
  .post('/update', async function (ctx, next) {
   console.log('11111111111111111');
    const array = ctx.request.body.array;
    const userArray = await request({
      method: 'POST',
      uri: `http://192.168.16.176:9888/account/updateAccount`,
      body: array,
      json: true
    });
    console.log(userArray);
    ctx.body = userArray;
  })
  .post('/delete', async function (ctx){
    const id = ctx.request.body.id;
    console.log(id);
    const result = await request({
      method: 'DELETE',
      uri: `http://192.168.16.176:9888/account/deleteAccount/${id}`,
      json: true
    });
    ctx.body = result;
  });

module.exports = router;

/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)

// --- 自定义消息接口 Demo --- //
// GET 获取电影列表
router.get('/movie', controllers.movie.list)

//  GET 获取电影的详细信息
router.get('/movie/:id', controllers.movie.detail)

// POST 添加评论
router.post('/comment', validationMiddleware, controllers.comment.add)

// GET 获取评论列表
router.get('/comment/me', validationMiddleware, controllers.comment.me)

// GET 获取评论列表
router.get('/comment', validationMiddleware, controllers.comment.list)

// GET 获取评论列表(用户未登录)
router.get('/comment/unlogin/recommend', controllers.comment.getOneCommentNotlogin)

// GET 获取评论列表(用户已登录)
router.get('/comment/login/recommend', controllers.comment.getOneCommentLogin)

// POST 添加收藏
router.post('/collect', validationMiddleware, controllers.collect.add)

// GET 获取收藏列表
router.get('/collect', validationMiddleware, controllers.collect.list)

// DELETE 删除收藏评论
router.delete('/collect', validationMiddleware, controllers.collect.remove)

module.exports = router

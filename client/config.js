/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://sst8nsl0.qcloud.la';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp/tunnel`,

        // 上传图片接口&音频
        uploadUrl: `${host}/weapp/upload`,

        // 获取电影列表
        movieList: `${host}/weapp/movie`,

        // 获取电影的详细信息
        movieDetail: `${host}/weapp/movie/`,

        // 添加评论
        addComment: `${host}/weapp/comment`,

        // 获取评论列表
        commentList: `${host}/weapp/comment`,

        // 获取“我”发布的影评
        myCommentList: `${host}/weapp/comment/me`,

        // 获取推荐影评
        recommendCommentUnlogin: `${host}/weapp/comment/unlogin/recommend`,

        // 收藏评论
        addCollected: `${host}/weapp/collect`,

        // 获取收藏评论列表
        collectedList: `${host}/weapp/collect`,

        // 删除收藏评论
        deleteCollected: `${host}/weapp/collect`,
    }
};

module.exports = config;

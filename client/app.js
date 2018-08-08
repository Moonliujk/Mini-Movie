//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

var userInfo
/**
 * problem: 
 * ---小程序的登录过程及保持会话的实现？
 */

App({
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl)
    },
    /**
     * 会话检查
     */
    checkSession({success, fail, complete}) {
      // 存在登录信息，直接返回
      console.log('checkSession')
      console.log('userInfo', userInfo)
      if (userInfo) {
        console.log('checkSession success', userInfo)
        success && success(userInfo)
        return
      }
      // 首次检查
      wx.checkSession({
        // 检查会话信息成功后，获取用户信息
        success: () => {
          wx.getUserInfo({
            success: res => {
              userInfo = res.userInfo
              console.log('getUserInfo success')
              success && success(userInfo)
            },
            fail: err => {
              console.log(err)
              console.log('getUserInfo fail')
              fail && fail(err)
            }
          })
        },
        fail: err => {
          // session_key 已经失效，需要重新执行登录流程
          wx.login()
          fail && fail(err)
        }
      })
    },
    /**
     * 登录功能函数
     */
    onTapLogin(e) {
      userInfo = e.detail.userInfo
      console.log('userInfo', userInfo)
    },
})
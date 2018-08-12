// component/userLogin/userLogin.js
let app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    description: { // 提示文字
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
   /**
   * 未登录状态下，点击登录，获取用户信息
   */
    onTapLogin(e) {
      app.onTapLogin(e)
      let userInfo = e.detail.userInfo

      this.setData({
        userInfo
      })

      this.triggerEvent('getUserInfo', userInfo)
    },
   /**
   * 返回前一页面
   */
    onTapBackTo() {
      //console.log('back to last page')
      wx.navigateBack()
    },
  }
})

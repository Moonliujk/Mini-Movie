// component/header/header.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    isWhiteIcon: {
      type: String,
      value: 'true',
    },
    textColor: {
      type: String,
      value: 'white'
    },
    bgColor: {
      type: String,
      value: '#342158'
    },
    position: {
      type: String,
      value: 'fixed'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTapBackto() {
      wx.navigateBack()
    },
  }
})

// component/dialog/dialog.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    commentId: {
      type: Number,
      value: 1
    },
    title: {
      type: String,
      value: '评论'
    },
    useravatar: {
      type: String,
      value: ''
    },
    username: {
      type: String,
      value: ''
    },
    content: {
      type: String,
      value: '暂无评论'
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
    /**
       * 收藏评论：post请求，谁（当前登录用户）收藏了哪条评论（获取的comment_id）
       */
    onTapCollectComment() {  
      let commentId = this.data.commentId

      this.triggerEvent('commentCollectChange', commentId)   
    }
  }
})

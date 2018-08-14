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
    },
    isCollected: {
      type: String,
      value: 'false'
    },
    isSelfComment: {
      type: String,
      value: 'false'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    commentType: undefined
  },

  attached() {
    this.init()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      this.setData({
        commentType: this.data.isCollected
      })
    },
    /**
       * 收藏评论：post请求，谁（当前登录用户）收藏了哪条评论（获取的comment_id）
       */
    onTapCollectComment() {  
      if (this.data.isSelfComment == true) return 

      let commentId = this.data.commentId
      let commentType = this.data.commentType

      if (!commentType) {
        commentType = this.data.isCollected // 首次加载时，取该值
      } else {
        commentType = !commentType
      }

      console.log('isCollected:', commentType)

      this.setData({
        commentType
      })

      this.triggerEvent('commentCollectChange', commentId)   
    }
  }
})


// component/dialog/dialog.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    commentList: {
      type: Array,
      value: []
    },
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
      let index = this.data.commentId
      let commentList = this.data.commentList
      let comment = commentList[index]
      let url,
        method;

      if (!comment.isCollected) {
        console.log('收藏评论')
        url = config.service.addCollected
        method = 'POST'
      } else {
        console.log('删除收藏')
        url = config.service.deleteCollected
        method = 'DELETE'
      }

      qcloud.request({
        url,
        method,
        data: {
          commentId: comment.id
        },
        success: (res) => {
          let data = res.data
          if (!data.code) {
            wx.showToast({
              title: '操作成功',
            })

            commentList[index].isCollected = !commentList[index].isCollected

            this.setData({
              commentList
            })

            this.triggerEvent('commentCollectChange', commentList)
            
          } else {
            wx.showToast({
              icon: 'none',
              title: '操作失败',
              image: '../../image/error.svg'
            })
          }
        },
        fail: (res) => {
          console.log(res)
          wx.showToast({
            icon: 'none',
            title: '操作失败',
            image: '../../image/error.svg'
          })
        }
      })
    }
  }
})

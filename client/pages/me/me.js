// pages/me/me.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
const _ = require('../../utils/util')

let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    collectedCommentList: [],
    myComment: [],
    commentId: 0,
    isShowModal: false,
    showComment: null,
    isCollectedCommentPage: true,  // “我的收藏”与“我的发布”列表切换
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCollectedCommentList() 
    this.getMyComments()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.checkSession({
      success: userInfo => {
        console.log(userInfo)
        this.setData({
          userInfo,
          isLogin: true
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '会话超期',
          image: '/image/error.svg'
        })
      }
    })
  },
  /**
   * 用户登录
   */
  userLoginEvent(e) {
    let userInfo = e.detail

    this.setData({
      userInfo,
    })
  },
  /**
   * 获得用户搜藏评论列表
   */
  getCollectedCommentList() {
    wx.showLoading({
      title: '加载收藏列表...',
    })

    qcloud.request({
      url: config.service.collectedList,
      success: (res) => {
        wx.hideLoading()
        let data = res.data

        if (!data.code) {
          wx.showToast({
            title: '加载成功',
          })
          console.log('collectedCommentList:',data.data)
          let collectedCommentList = data.data
          // console.log(collectedCommentList)

          this.setData({
            collectedCommentList
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '加载失败',
            image: '../../image/error.svg'
          })
        }
      },
      fail: (res) => {
        wx.hideLoading()
        console.log(res)
        wx.showToast({
          icon: 'none',
          title: '加载出错',
          image: '../../image/error.svg'
        })
      }
    })
  },
  /**
   * 获得我发布的影评
   */
  getMyComments() {
    console.log('加载收藏列表...')
    wx.showLoading({
      title: '加载收藏列表...',
    })

    qcloud.request({
      url: config.service.myCommentList,
      success: (res) => {
        wx.hideLoading()
        let data = res.data
        console.log('myComment:', data)

        if (!data.code) {
          wx.showToast({
            title: '加载成功',
          })
          console.log('myComment:',data.data)
          let myComment = data.data

          this.setData({
            myComment
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '加载失败',
            image: '../../image/error.svg'
          })
        }
      },
      fail: (res) => {
        wx.hideLoading()
        console.log(res)
        wx.showToast({
          icon: 'none',
          title: '加载出错',
          image: '../../image/error.svg'
        })
      }
    })
  },
  /**
   * 收藏/取消收藏评论
   */
  onTapCollectComment(e) {
    let commentId = e.currentTarget.dataset.id

    this.changeCommentStatus(commentId)
  },
  /**
   * 收藏/删除收藏评论：post/DELETE请求，谁（当前登录用户）收藏了哪条评论（获取的comment_id）
   */
  changeCommentStatus(commentId) {
    let self = this
    console.log(commentId)
    let collectedCommentList = this.data.collectedCommentList
    let comment = collectedCommentList.find(item => {
      return item.id == commentId
    })
    console.log('comment', comment)
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
        commentId
      },
      success: (res) => {
        let data = res.data
        if (!data.code) {
          wx.showToast({
            title: '操作成功',
          })

          comment.isCollected = !comment.isCollected

          this.setData({
            collectedCommentList
          })
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
  },
  /**
   * 在对话框中修改收藏影评触发的事件
   */
  commentCollectChange(e) {
    // console.log(e.detail)
    console.log(e.detail)
    let commentId = e.detail


    this.changeCommentStatus(commentId)
  },
  /**
   * 显示弹出层
   */
  onTapShowComment(e) {
    let isShowModal = true
    let commentId = e.currentTarget.dataset.id
    let commentList = this.data.isCollectedCommentPage ? this.data.collectedCommentList : this.data.myComment
    let showComment = commentList.find(item => {
      return item.id == commentId
    })

    console.log('showComment:', showComment)

    this.setData({
      isShowModal,
      showComment
    })
  },
  /**
   * 隐藏弹出层
   */
  onTapHiddenModal() {
    let isShowModal = false

    this.setData({
      isShowModal
    })
  },
  /**
   * 切换页面显示
   */
  onTapChangeList() {
    console.log('我的发布')
    let isCollectedCommentPage = !this.data.isCollectedCommentPage

    this.setData({
      isCollectedCommentPage
    })
  }
})
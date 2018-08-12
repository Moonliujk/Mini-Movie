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
    commentId: 0,
    isShowModal: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCollectedCommentList() 
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
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
          console.log(data.data)
          let collectedCommentList = data.data
          console.log(collectedCommentList)

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
   * 在对话框中修改收藏影评触发的事件
   */
  commentCollectChange(e) {
    console.log(e.detail)
    let commentList = e.detail

    this.setData({
      commentList
    })
  },
  /**
   * 收藏评论：post请求，谁（当前登录用户）收藏了哪条评论（获取的comment_id）
   */
  onTapCollectComment(e) {
    let index = e.currentTarget.dataset.index
    let self = this
    let collectedCommentList = this.data.collectedCommentList
    let comment = collectedCommentList[index]
    let url,
        method;

    if (!comment.item.isCollected) {
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
        commentId: comment.item.id
      },
      success: (res) => {
        let data = res.data
        if (!data.code) {
          wx.showToast({
            title: '操作成功',
          })

          collectedCommentList[index].item.isCollected = !collectedCommentList[index].item.isCollected

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
   * 显示弹出层
   */
  onTapShowComment(e) {
    let isShowModal = true
    let commentId = e.currentTarget.dataset.index

    this.setData({
      isShowModal,
      commentId
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
})
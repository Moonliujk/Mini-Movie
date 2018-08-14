// pages/movie_comment/movie_comment.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
const _ = require('../../utils/util')
// 定义录音全局变量
// const recorderManager = wx.getRecorderManager()
// 定义播放语音全局变量
// const innerAudioContext = wx.createInnerAudioContext()
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    movieDetail: {
      /*id: 1,
      title: '壁花少年',
      image: 'https://movie-1256948132.cos.ap-beijing.myqcloud.com/p1874816818.jpg',*/
    },
    commentList: [
      /*{
        name: 'Lesile',
        image: '../../image/user.jpg',
        comment: '真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！',
      }*/
    ],
    testComment: {
        name: 'Lesile',
        image: '../../image/user.jpg',
        comment: '真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！',
      },
    collectComment: [],
    barrageComment: [],  // 用于展示弹幕的评论列表
    lastCommentNum: 0,  // 记录评论选取的数字号
    showComment: null,
    isShowModal: false,
    isNormalList: true,
    isShowNormalList: true, // 显示普通列表
    isShowBarrageList: false, // 显示弹幕列表
    isRotatingList: false,  // 到达90°
    isHiddenImage: false,
    isAnimating: false,  //动画进行中
    isRotatingListFull: false,  // 旋转普通动画开始与结束
    isRotatingBarrage: false,
    isRotatingListReverse: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.movieid)
    let movieid = options.movieid || 4
    this.getCommentList(movieid)
    this.getMovieInfo(movieid)
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
    // 添加评论后能够及时显示
    if (this.data.movieDetail) {
      let movieId = this.data.movieDetail.id

      this.getCommentList(movieId)
    }
    // 会话检查
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
   * 获取评论列表
   */
  getCommentList(movieId) {
    console.log('movieId', movieId)
    wx.showLoading({
      title: '加载评论列表...',
    })

    qcloud.request({
      url: config.service.commentList,
      data: {
        movieId
      },
      success: res => {
        wx.hideLoading()
        console.log('res', res)
        let data = res.data;

        if (!data.code) {
          let commentList = data.data
          console.log("data.data", data.data)
          console.log('comment', commentList)

          this.chooseTextComment(commentList)

          this.setData({
            commentList
          })
        } else {
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
          wx.showToast({
            icon: 'none',
            title: '评论加载出错',
            image: '../../image/error.svg'
          })
        }
      },
      fail: res => {
        wx.hideLoading()
        console.log(res)
        wx.showToast({
          icon: 'none',
          title: '评论加载出错',
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
    let commentId = e.currentTarget.dataset.id
    let showComment = this.data.commentList.find(item =>{
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
   * 开启/关闭弹幕列表
   */
  onTapBarrageComment() {
    let isNormalList = !this.data.isNormalList
    console.log("click button", isNormalList)

    if (isNormalList) { // 转换为普通列表
      this.setData({
        isRotatingBarrage: true,
        isAnimating: true,
      })
    } else {  // 转换为弹幕模式
      this.setData({
        isRotatingListFull: true,
        isAnimating: true,
      })
    }

  },
  /**
   * 跳转到发表影评页面
   */
  onTapWriteComment() {
    let movieId = this.data.movieDetail.id

    wx.navigateTo({
      url: `/pages/edit_comment/edit_comment?movieid=${movieId}`,
    })
  },
  /**
   * 获得电影详情
   */
  getMovieInfo(movieId) {
    console.log(movieId)

    wx.showLoading({
      title: '加载电影信息...',
    })

    qcloud.request({
      url: config.service.movieDetail + movieId,
      success: res => {
        wx.hideLoading()

        let data = res.data
        console.log(data)
        if (!data.code) {
          wx.showToast({
            title: '加载成功'
          })

          this.setData({
            movieDetail: data.data,
            movieId
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '加载失败',
            image: '../../image/error.svg'
          })

          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/hot_movie/hot_movie',
            })
          }, 2000)
        }
      },
      fail: res => {
        wx.hideLoading()

        console.log(res)

        wx.showToast({
          icon: 'none',
          title: '加载失败',
          image: '../../image/error.svg'
        })

        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/hot_movie/hot_movie',
          })
        }, 2000)
      }
    })
  },
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
    let commentList = this.data.commentList
    let comment = commentList.find(item => {
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
            commentList
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

    this.changeCommentStatus(e.detail)
  },
  /**
   * 隐藏元素
   */
  hiddenCommentList() {
    console.log('finishhalf')
    this.setData({
      isRotatingList: true,
      isShowNormalList: false,   
    })
  },
  /**
   * 完成动画：从列表到弹幕转换 
   */
  finishAnimation() {
    console.log('finishAnimation')
    this.setData({
      isHiddenImage: true,
      isNormalList: false,
      isRotatingList: false,
      isShowBarrageList: true,
      isRotatingListFull: false,      
      isAnimating: false,
    })
    
    this.initBarrageComment()

  },
  /**
   * 完成动画：弹幕绕y旋转90°
   */
  rotateBarrageFinish() {
    this.setData({
      isRotatingListReverse: true,
      isShowBarrageList: false,
      isShowNormalList: true,
    })
  },
  /**
   * 完成动画：列表绕y旋转90度
   */
  rotateListFinish() {
    this.setData({
      isRotatingListReverse: false,
      isHiddenImage: false,
      isNormalList: true,  
      isRotatingBarrage: false,
      isAnimating: false,
    })
  },
  /**
   * 选取文字评论
   */
  chooseTextComment(commentList) {
    let barrageComment = []

    commentList.forEach(item => {
      if (item.type === 'text') {
        item.isShowComment = false  // 添加表示，用来判断评论是否曾经添加到弹幕列表中
        barrageComment.push(item)
      }
    })

    this.setData({
      barrageComment
    })
  },
  /**
   * 初始化弹幕
   */
  initBarrageComment() { 
    let barrageComment = this.data.barrageComment

    barrageComment.forEach(item => {
      if (!item.isShowComment) {
        item = this.barrageCommentParam(item)
        setTimeout(() => {
          console.log('true')
          item.isShowComment = true  // 间隔 item.showTime 时间后，在屏幕上显示弹幕

          this.setData({
            barrageComment
          })
        }, item.showTime) 
      }
    })

    this.setData({
      barrageComment
    })
  },
  /**
   * 为弹幕分配动画参数
   */
  barrageCommentParam(item) {
    let mode = ['slow', 'medium', 'hight']  // 定义评论运动模式

    item.mode = mode[Math.floor(Math.random() * 3)]
    item.location = Math.floor(Math.random() * 1000)
    item.showTime = Math.floor(Math.random() * 500)

    return item
  },
  /**
   * 隐藏已完成的弹幕
   */
  hiddenBarrageComment(e) {
    console.log('animationend')
    let index = e.currentTarget.dataset.index

    let barrageComment = this.data.barrageComment
    barrageComment[index].isShowComment = false

    this.setData({
      barrageComment
    })

    setTimeout(() => {
      this.initBarrageComment()
    }, 100)
  }
})
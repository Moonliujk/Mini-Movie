// pages/movie_comment/movie_comment.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
const _ = require('../../utils/util')
// 定义录音全局变量
const recorderManager = wx.getRecorderManager()
// 定义播放语音全局变量
const innerAudioContext = wx.createInnerAudioContext()

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    textComment: [],  // 所有的文字评论，从中挑选置入 barrageComment 中 
    barrageComment: [],  // 用于展示弹幕的评论列表
    lastCommentNum: 0,  // 记录评论选取的数字号
    commentId: 0,
    isShowModal: false,
    isNormalList: true,
    isChangedCommentWay: false,  // 旋转动画开始
    isReachAngle: false,  // 到达90°
    isFinishAnimation: false,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.movieid)
    let movieid = options.movieid || 4
    this.getCommentList(movieid)
    this.getMovieInfo(movieid)
    setTimeout(() => {
      this.setData({
        isChangedCommentWay: true,
      })
    }, 3000)
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
          })
        }
      },
      fail: res => {
        wx.hideLoading()
        console.log(res)
        wx.showToast({
          icon: 'none',
          title: '评论加载出错',
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
            title: '加载失败',
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
          title: '加载失败',
        })

        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/hot_movie/hot_movie',
          })
        }, 2000)
      }
    })
  },
  /**
   * 收藏评论：post请求，谁（当前登录用户）收藏了哪条评论（获取的comment_id）
   */
  onTapCollectComment(e) {
    let index = e.currentTarget.dataset.index
    let self = this
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
        } else {
          wx.showToast({
            title: '操作失败',
          })
        }
      },
      fail: (res) => {
        console.log(res)
        wx.showToast({
          title: '操作失败',
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
   * 隐藏元素
   */
  hiddenCommentList() {
    console.log('finishhalf')
    this.setData({
      isReachAngle: true,      
    })
  },
  /**
   * 完成动画 
   */
  finishAnimation() {
    console.log('finishAnimation')
    this.setData({
      isFinishAnimation: true,
      isNormalList: false,
    })
    
    this.createBarrageComment()
  },
  /**
   * 选取文字评论
   */
  chooseTextComment(commentList) {
    let textComment = []

    commentList.forEach(item => {
      if (item.type === 'text') {
        item.isChoosed = false  // 添加表示，用来判断评论是否曾经添加到弹幕列表中
        textComment.push(item)
      }
    })

    this.setData({
      textComment
    })
  },
  /**
   * 生成弹幕
   */
  createBarrageComment() { 
    let mode = ['slow', 'medium', 'hight']  // 定义评论运动模式
    let location = [20, 250, 500, 750]     // 定义高度
    let textComment = this.data.textComment
    let length = textComment.length
    if (length < 5) return  //文字评论数小于5，则不会展现

    let temp 
    let randomNum
    let barrageComment = this.data.barrageComment
    let lastCommentNum = this.data.lastCommentNum
    lastCommentNum = lastCommentNum === length - 1 ? 0 : lastCommentNum

    while (barrageComment.length < 5) {
      temp = textComment[lastCommentNum]
      randomNum = Math.floor(Math.random()*3)
      temp.mode = mode[randomNum]
      randomNum = Math.floor(Math.random() * 4)
      temp.location = location[randomNum]

      barrageComment.push(temp)
      lastCommentNum = ++lastCommentNum === length - 1 ? 0 : lastCommentNum
    }

    this.setData({
      barrageComment,
      lastCommentNum,
    })

    // console.log('barrageComment:', barrageComment)
  },
  /**
   * 删除已完成的弹幕
   */
  deleteBarrageComment(e) {
    console.log('animationend')
    let index = e.currentTarget.dataset.index

    let barrageComment = this.data.barrageComment.splice(index, 1)

    this.setData({
      barrageComment
    })

    this.createBarrageComment()
  }
})
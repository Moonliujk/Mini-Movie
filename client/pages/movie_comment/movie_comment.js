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
      id: 0,
      title: '壁花少年',
      image: 'https://movie-1256948132.cos.ap-beijing.myqcloud.com/p1874816818.jpg',
    },
    commentList: [
      /*{
        name: 'Lesile',
        image: '../../image/user.jpg',
        comment: '真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！',
      }*/
    ],
    comment_id: 0,
    isShowModal: false,
    // 音频相关参数
    audioProgress: 0,  // 音频进度条显示
    willReplayingStart: true, // 音频回放初始状态
    willReplay: false,
    willReplayingPause: false,  // 回访录音结束
    willReplayingOver: false,
    audioDuration: 0,  // 录音总时长
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let movieid = options.movieid ? options.movieid : 2
    this.getCommentList(movieid)
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
    this.getCommentList(2)
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
  getCommentList(movie_id) {
    wx.showLoading({
      title: '加载评论列表...',
    })

    qcloud.request({
      url: config.service.commentList,
      data: {
        movie_id
      },
      success: res => {
        wx.hideLoading()
        console.log('res', res)
        let data = res.data;

        if (!data.code) {
          // 数据处理，对于音频文件与非音频文件加以区分
          let commentList = (data.data).map((item, index) => {
            if (/^http:\/\/tmp/.test(item.content)) {
              return {...item, isTxt: false}
            } else {
              return { ...item, isTxt: true}
            }
          })

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
    let isShowModal = !this.data.isShowModal
    let comment_id = e.currentTarget.dataset.index

    this.setData({
      isShowModal,
      comment_id
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
   * 计时器函数
   */
  timer(method, interval, fn) {
    let timeFlag = this.data.timeFlag
    let self = this
    let isTimerOver

    isTimerOver = this.data.willReplayingPause || this.data.willReplayingOver

    if (timeFlag) {
      clearTimeout(self.timer, interval)
    }

    console.log(isTimerOver)

    if (!isTimerOver) {
      timeFlag = setTimeout(self.timer.bind(self, method, interval, fn), interval)
    }

    this.setData({
      timeFlag,
    })

    fn && fn()  // 存在功能函数，则执行
  },
  /**
   * 播放录音
   */
  onTapPlayRecord(e) {
    console.log(e)
    let audioIndex = e.currentTarget.dataset.index
    let audioSrc = this.data.commentList[audioIndex].content
    let self = this
    let audioProgress = this.data.audioProgress

    if (audioSrc && this.data.willReplayingStart) {
      console.log('1')
      innerAudioContext.src = this.data.audioSrc
      innerAudioContext.startTime = 0
      innerAudioContext.play() // 开始播放
      console.log('开始播放', '总时长：' + innerAudioContext.duration)
      // 播放开始
      this.setData({
        willReplayingStart: false,
        willReplay: true,
        willReplayingPause: false,
        willReplayingOver: false,
      })

      // 音频结束时调用的事件
      innerAudioContext.onEnded(() => {
        // self.onTapPauseRecord()
        console.log('音频播放结束')
        self.setData({
          audioProgress: 100,
          willReplayingOver: true,
          willReplayingStart: true,
        })
        // 音频图标转换，准备第二次播放
        setTimeout(() => {
          innerAudioContext.offEnded()
          self.setData({
            audioProgress: 0,
            willReplay: false,
          })
        }, 300)
      })
      // 更新音频duration
      innerAudioContext.onTimeUpdate(() => {
        this.setData({
          audioDuration: innerAudioContext.duration,
        })
      })
      // 执行进度条计算
      this.timer('replay', 60, this.audioProgress)
      // 播放出错处理
      innerAudioContext.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
      })
    } else {
      // 恢复播放时所需执行的事件
      innerAudioContext.startTime = innerAudioContext.currentTime
      console.log(innerAudioContext.startTime)
      innerAudioContext.play()

      this.setData({
        willReplay: true,
        willReplayingPause: false,
      })

      // 执行进度条计算
      this.timer('replay', 60, this.audioProgress)
      console.log('录音恢复', '当前时长：' + innerAudioContext.currentTime)
    }
  },
  /**
   * 暂停播放录音
   */
  onTapPauseRecord() {
    innerAudioContext.pause()
    console.log('录音暂停', '总时长：' + innerAudioContext.duration, '当前时长：' + innerAudioContext.currentTime)
    this.setData({
      willReplay: false,
      willReplayingPause: true,
    })
  },
  /**
   * 回放录音进度条计算
   */
  audioProgress() {
    let audioDuration = this.data.audioDuration
    audioDuration = audioDuration === 0 ? 1 : audioDuration

    let audioProgress = (innerAudioContext.currentTime / audioDuration) * 100
    console.log(audioProgress)
    /* Problem: 由于timer函数在结束开关打开后会默认多执行一步功能函数，
     * 导致在重新开始后，进度条会出现100%闪现
    */
    this.setData({
      audioProgress,
    })
  },
})
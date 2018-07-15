const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
let userInfo
/**
 * TODOlist
 * problem：
 * ---进度条在重新播放的时候会有闪烁（从100%回到当前位置）
 * ---退出后再次进入音频预览界面无法正常播放
 * ---从弹出框界面退回到评论编辑页面（音频），录音时间文字依旧闪烁，也需要重弄新更新文字
 *    信息
 * needToDo:
 * ---添加评论数据表，关联电影以及评论这两张表
 * ---完成电影评论的显示
 * ---添加预告片以及主题曲
 */

// 定义录音全局变量
const recorderManager = wx.getRecorderManager()
// 定义播放语音全局变量
const innerAudioContext = wx.createInnerAudioContext()
// let currentTime = 0

// pages/edit_comment/edit_comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    isLogin: false,
    isEnterEdit: false,
    isAudioSuccess: false,
    timeFlag: null,
    currentTime: -1,
    isRecording: false,
    isRecorderOver: false,
    isShowModal: false,  // 弹出框显示标记
    recordInfo: '点击图标开始录音',
    recordTxt: '未录音',
    audioSrc: null,  // 音频文件
    userComment: '',  // 文字评论
    audioProgress: 0,  // 音频进度条显示
    isReplaying: false,
    isReplayingOver: false,  // 回访录音结束
    audioDuration: 0,  // 录音总时长
    movieDetail: {
      id: 0,
      title: '壁花少年',
      image: 'https://movie-1256948132.cos.ap-beijing.myqcloud.com/p1874816818.jpg',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let movieId = options.movieid

    this.getMovieInfo(movieId)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.checkSession()
    console.log(userInfo)
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
  getMovieInfo(movieId) {
    movieId = 2

    wx.showLoading({
      title: '加载电影信息...',
    })

    qcloud.request({
      url: config.service.movieDetail + movieId,
      success: res => {
        wx.hideLoading()
        console.log(res)
        let data = res.data
        console.log('movie:',data)
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
   * 未登录状态下，点击登录，获取用户信息
   */
  onTapLogin(e) {
    let userInfo = e.detail.userInfo
    let isLogin = true

    this.setData({
      userInfo,
      isLogin,
    })
  },
  /**
   * 会话检查
   */
  checkSession() {
    // 存在登录信息，直接返回
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
      })
      return 
    }
    // 首次检查
    wx.checkSession({
      // 检查会话信息成功后，获取用户信息
      success: () => {
        wx.getUserInfo({
          success: res => {
            userInfo = res.userInfo

            this.setData({
              isLogin: true,
              userInfo: userInfo,
            })
          },
          fail: res => {
            console.log(res)
          }
        })
      },
      fail: res => {
        wx.showToast({
          title: '会话超期，请重新登陆',
        })
      }
    })
  },
  /**
   * 返回前一页面
   */
  onTapBackTo() {
    console.log('back to last page')
    wx.navigateBack()
  },
  /**
   * 
   */
  onTapChangeCommentWay() {
    let isEnterEdit = !this.data.isEnterEdit

    this.setData({
      isEnterEdit,
    })
  },
  /**
   * 录音开始
   */
  onTapStartTaping() {
    const options = {
      duration: 60000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'aac',
      frameSize: 50
    }

    // currentTime = 0

    recorderManager.start(options)
    // let self = this

    this.setData({
      isRecording: true,
      isRecorderOver: false,
      currentTime: -1,
      recordTxt: '正在录音...',
    })

    recorderManager.onStart(() => {
      console.log(this)
      this.timer('taping', 1000, this.countTapingTime)
    })
  },
  /**
   * 录音结束
   */
  onTapStopTaping() {
    recorderManager.stop()

    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      const { tempFilePath } = res

      this.setData({
        audioSrc: tempFilePath,
        isAudioSuccess: true,
        isRecording: false,
        isRecorderOver: true,
        // recordInfo: `重新录制`,
        recordTxt: '录音结束，点击预览评论可查看已录制音频',
      })
    })
  },
  /**
   * 计时器函数
   */
  timer(method, interval, fn) {
    let timeFlag = this.data.timeFlag
    let self = this
    let isTimerOver
    
    if (method === 'taping') {  // 录音截止
      isTimerOver = this.data.isRecorderOver
    } else if (method === 'replay') {  // 回放录音截止
      isTimerOver = this.data.isReplayingOver
    }

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
   * 记录录音时长
   */
  countTapingTime() {
    let isRecorderOver = this.data.isRecorderOver
    let currentTime = this.data.currentTime
    let showTime = ''

    console.log(currentTime)

    // 时间递增
    if (currentTime !== 59) {
      currentTime++
    } else {
      this.onTapStopTaping()
    }
    // formatting time output
    if (currentTime < 10) {
      showTime = '0:0' + currentTime
    } else if (currentTime === 59) {
      showTime = '1:00'
    } else {
      showTime = '0:' + currentTime
    }

    if (!isRecorderOver) {
      this.setData({
        currentTime,
        recordInfo: `录音计时：${showTime}`
      })
    }
  },
  /**
   * 播放录音
   */
  onTapPlayRecord() {
    let audioSrc = this.data.audioSrc
    let self = this

    if (audioSrc && this.data.audioDuration === 0) {
      innerAudioContext.src = this.data.audioSrc
      innerAudioContext.startTime = 0
      innerAudioContext.play() // 开始播放
      console.log('开始播放', '总时长：'+innerAudioContext.duration)
      // 播放开始
      this.setData({
        isReplaying: true,
        audioProgress: 0,
      })

      // 音频结束时调用的事件
      innerAudioContext.onEnded(() => {
        self.onTapPauseRecord()
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
        isReplaying: true,
        isReplayingOver: false,
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
    console.log('录音暂停', '总时长：' + innerAudioContext.duration, '当前时长：' +innerAudioContext.currentTime)
    this.setData({
      isReplaying: false,
      isReplayingOver: true,
      audioProgress: 100,
    })
  },
  /**
   * 回放录音进度条计算
   */
  audioProgress() {
    let audioProgress = (innerAudioContext.currentTime / this.data.audioDuration) * 100
    console.log(audioProgress)
    this.setData({
      audioProgress,
    })
  },
  /**
   * 输入评论
   */
  onInput(e) {
    this.setData({
      userComment: e.detail.value.trim(),
    })
  },
  /**
   * 预览评论
   */
  onTapPreviewComment() {
    this.setData({
      isShowModal: true,
    })
  },
  /**
   * 隐藏弹出层
   */
  onTapHiddenModal() {
    this.setData({
      isShowModal: false,
    })
  }
})
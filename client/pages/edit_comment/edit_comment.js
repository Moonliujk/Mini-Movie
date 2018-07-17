const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
let userInfo
/**
 * TODOlist
 * problem：
 * ---进度条在继续播放时出现闪现
 * ---修改编辑评论页的UI
 * ---
 * needToDo:
 * ---添加评论数据表，关联电影以及评论这两张表(!!!今晚完成)
 * ---
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
    isEnterEdit: false, // 选择文字评论
    isAudioSuccess: false,
    timeFlag: null,
    currentTime: -1, // 录音计时
    isRecording: false,
    isRecorderOver: false,
    isShowModal: false,  // 弹出框显示标记
    recordInfo: '点击图标开始录音',
    recordTxt: '未录音',
    audioSrc: '',  // 音频文件
    userComment: '',  // 文字评论
    audioProgress: 0,  // 音频进度条显示
    willReplayingStart: true, // 音频回放初始状态
    willReplay: false,
    willReplayingPause: false,  // 回访录音结束
    willReplayingOver: false, 
    audioDuration: 0,  // 录音总时长
    movieDetail: {},
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
    let self = this
    recorderManager.stop()

    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      let duration = res.duration
      if (duration > 3000) {  // 判断录音时长是否满足要求
        let { tempFilePath } = res

        this.setData({
          audioSrc: tempFilePath,
          isAudioSuccess: true,
          isRecording: false,
          isRecorderOver: true,
          recordTxt: '录音结束，点击预览评论可查看已录制音频',
        })

        setTimeout(() => {
          self.setData({
            recordInfo: '重新录制',
            isRecorderOver: false,
          })
        }, 1800)
      } else {
        wx.showToast({
          title: '录音时长过短',
          icon: 'none',
        })

        this.setData({
          isAudioSuccess: true,
          isRecording: false,
          isRecorderOver: true,
          recordTxt: '未录音',
        })

        setTimeout(() => {
          self.setData({
            recordInfo: '点击图标开始录音',
            isRecorderOver: false,
          })
        }, 1800)

      }
      
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
      isTimerOver = this.data.willReplayingPause || this.data.willReplayingOver
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
    let audioProgress = this.data.audioProgress

    if (audioSrc && this.data.willReplayingStart) {
      console.log('1')
      innerAudioContext.src = this.data.audioSrc
      innerAudioContext.startTime = 0
      innerAudioContext.play() // 开始播放
      console.log('开始播放', '总时长：'+innerAudioContext.duration)
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
    console.log('录音暂停', '总时长：' + innerAudioContext.duration, '当前时长：' +innerAudioContext.currentTime)
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
   * 重新编辑评论
   */
  onTapReedit() {
    // 如果重新编辑音频，则原音频文件销毁
    if (!this.data.isEnterEdit) {
      this.setData({
        // 音频相关信息初始化
        audioSrc: '',
        recordInfo: '点击图标开始录音',
        recordTxt: '未录音',
      })
    }

    this.onTapHiddenModal() 
  },
  /**
   * 隐藏弹出层
   */
  onTapHiddenModal() {
    this.setData({
      isShowModal: false,
      // 回放音频部分参数初始化
      willReplayingStart: true, // 音频回放初始状态
      willReplay: false,
      willReplayingPause: false,  // 回访录音结束
      willReplayingOver: false, 
    })
  }
})
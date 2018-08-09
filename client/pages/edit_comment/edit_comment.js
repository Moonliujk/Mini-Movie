const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
// let userInfo
var app = getApp()

/**
 * TODOlist
 * problem：
 * ---进度条在继续播放时出现闪现
 * ---修改编辑评论页的UI
 * ---用户名字中带有emoji，会报错
 * needToDo:
 * -------7.21 todoList-------------
 * ---建立收藏评论表（包含id, collected_user, comment_id及create_time)
 * ---玩成对与评论表以及收藏表的引用
 * ---完善小程序内部各个按钮事件
 * -------8.1 todoList-------------
 * ---为音频加上时间显示
 * ---将登陆功能函数添加到app.js全局文件中 √
 * ---优化edit_comment.js中的相关函数
 * ---在个人收藏影评页面添加语音、弹出框
 * ---编写readme
 * -------8.2 todoList-------------
 * ---将语音播放添加为component
 * ---将登陆功能函数添加到app.js全局文件中 √
 * ---优化edit_comment.js中的相关函数
 * ---在个人收藏影评页面添加语音、弹出框
 * ---编写readme
 * ------------------------
 * ---在录音页面可以添加时间信息
 * ---添加预告片（无法添加视频）以及主题曲
 * ---可以添加收藏评论人数的展示，并进行排序
 * ---评论列表可以添加楼中楼的评论
 * ---评论发表后，页面自动跳转到电影的评论页面
 * ---预览并提交评论的按钮交互逻辑比较模糊，需要更改文字内容使功能更明确
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
    isUplaodingComment: false,  // 是否正在上传影评
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
    console.log(options.movieid)
    let movieId = options.movieid ? options.movieid : 2
    console.log(movieId)
    this.getMovieInfo(movieId)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log(app)
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
        })
      }
    })
    // console.log(userInfo)
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
    app.onTapLogin(e)
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
      duration: 60000,  // 最长录制一分钟
      sampleRate: 8000,
      numberOfChannels: 1,
      encodeBitRate: 16000,
      format: 'mp3',
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
      if (duration > 1500) {  // 判断录音时长是否满足要求
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
   * 删除语音
   */
  onTapDeleteAudio() {
    wx.showModal({
      title: '',
      content: '',
    })
  },
  /**
   * 输入评论
   */
  onInput(e) {
    this.setData({
      userComment: e.detail.value.trimLeft(),
    })
  },
  /**
   * 预览评论
   */
  onTapPreviewComment() {
    this.setData({
      isShowModal: true,
      userComment: this.data.isEnterEdit ? this.data.userComment.trim() : this.data.userComment
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
  },
  /**
   * 提交评论
   */
  onTapSubmitComment() {
    // 防止用户单击过快多次提交相同评论
    if (this.data.isUplaodingComment) return;
    let content

    this.setData({
      isUplaodingComment: true
    })

    if (this.data.isEnterEdit) {
      content = this.data.userComment

      if (!content) {
        return wx.showModal({
          title: '错误',
          content: '请先编辑评论，然后再提交',
        })
      }

      return this.commentSubmitRequest(content, 'text') // 提交文字评论
    } else {
      content = this.data.audioSrc   // 上传语音评论

      if (!content) {
        return wx.showModal({
          title: '错误',
          content: '请先编辑评论，然后再提交',
        })
      }

      return this.uploadAudio()
    }   
  },
  commentSubmitRequest(content, contentType) {
    qcloud.request({
      url: config.service.addComment,
      login: true,
      method: 'POST',
      data: {
        movie_id: this.data.movieDetail.id,
        content: content,
        type: contentType
      },
      success: res => {
        wx.hideLoading()

        this.setData({
          isUplaodingComment: false
        })

        let data = res.data

        if (!data.code) {
          wx.showToast({
            title: '添加评论成功',
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        } else {
          wx.showToast({
            icon: 'none',
            title: '添加评论失败',
          })
        }
      },
      fail: res => {
        wx.hideLoading()
        console.log(res)

        this.setData({
          isUplaodingComment: false
        })

        wx.showToast({
          icon: 'none',
          title: '添加评论失败',
        })
      }
    })
  },
  /**
   * 上传音频至存储桶
   */
  uploadAudio() {
    let self = this
    let audioSrc = this.data.audioSrc
    console.log(audioSrc)
    console.log('voice')
    wx.showLoading({
      title: '上传音频中...',
    })

    wx.uploadFile({
      url: config.service.uploadUrl,
      filePath: audioSrc,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      success: res => {
        wx.hideLoading()
        // console.log('res', res)
        let data = JSON.parse(res.data)
        // console.log('data', data)
        let content = data.data.imgUrl

        // console.log('content', content)

        if (!data.code) {   
          self.commentSubmitRequest(content, 'audio')
        } else {
          wx.showToast({
            icon: 'none',
            title: '上传失败',
          })
        }
      },
      fail: res => {
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '上传失败',
        })
        console.log(res)
      }
    }) 
  }
})
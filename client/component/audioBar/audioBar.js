// component/audioBar/audioBar.js
// 定义播放语音全局变量
// const innerAudioContext = wx.createInnerAudioContext()
/**
 * 调试后发现：
 * ---每一个自定义组件都是独立的，内部的数据并不共享
 * ---在自定义组件定义的全局变量会被所有组件共享
 */

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 组件编号
    audioBarIndex: {
      type: Number,
      value: 0
    },
    // 音频资源
    audioSrc: {
      type: String,
      value: ''
    },  
  },

  /**
   * 组件的初始数据
   */
  data: {
    timeFlag: null, // 时间标记
    isShow: true,  // 是否显示
    audioProgress: 0,  // 音频进度条显示
    willReplayingStart: true, // 音频回放初始状态
    willReplay: false,
    willReplayingPause: false,  // 回访录音结束
    willReplayingOver: false,
    audioDuration: 0,  // 录音总时长
    innerAudioContext: null,
  },
  /**
   * 组件的方法列表
   */
  methods: {
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

      //console.log(isTimerOver)

      if (!isTimerOver) {
        timeFlag = setTimeout(self.timer.bind(self, method, interval, fn), interval)
      }

      this.setData({
        timeFlag,
      })

      if (fn) {
        //console.log('函数存在')
        fn.call(this)
      } else {
        //console.log('函数bu存在')
      }

      // fn && fn.call(this)   存在功能函数，则执行
    },
    /**
     * 播放录音
     * 分为两种情况：初次播放 以及 暂停后再次播放
     */
    onTapPlayRecord() {
      let audioSrc = this.data.audioSrc
      let self = this
      let audioProgress = this.data.audioProgress
      console.log('null', !this.data.innerAudioContext)
      let innerAudioContext
      
      // 每一个自定义组件是独立的，所以为每一个组件创建一个播放音频的组件
      if (this.data.innerAudioContext) {
        innerAudioContext = this.data.innerAudioContext
      }
      

      if (this.data.willReplayingStart) {
        // 定义播放语音变量
        innerAudioContext = wx.createInnerAudioContext()
        let currentAudioIndex = this.data.audioBarIndex
        console.log('first play')
        // console.log(innerAudioContext.currentTime)
        innerAudioContext.src = audioSrc
        innerAudioContext.startTime = 0
        //console.log(innerAudioContext.startTime)
        //console.log(innerAudioContext.currentTime)
        innerAudioContext.play() // 开始播放

        this.setData({
          innerAudioContext,
          audioSrc,
          currentAudioIndex,
          audioProgress: 0,
          willReplayingStart: false,
          willReplay: true,
          willReplayingPause: false,
          willReplayingOver: false,
        })

        // 音频结束时调用的事件
        innerAudioContext.onEnded(() => {
          // innerAudioContext.startTime = 0
          this.setData({
            audioProgress: 100,
            willReplayingOver: true,
            willReplayingStart: true,
            currentAudioIndex: -1
          })
          // 播放完成后，音频图标转换，准备再次播放
          setTimeout(() => {
            // innerAudioContext.offEnded()
            this.setData({
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
        
        // 播放出错处理
        innerAudioContext.onError((res) => {
          console.log(res.errMsg)
          console.log(res.errCode)
        })
      } else {
        // 恢复播放时所需执行的事件
        console.log('continue to play')
        innerAudioContext.startTime = innerAudioContext.currentTime
        innerAudioContext.play()

        this.setData({
          willReplay: true,
          willReplayingPause: false,
        })

        // console.log('录音恢复', '当前时长：' + innerAudioContext.currentTime)
      }

      // 执行进度条计算
      this.timer('replay', 60, this.audioProgressCal.bind(this))
    },
    /**
     * 暂停播放录音
     */
    onTapPauseRecord() {
      let innerAudioContext = this.data.innerAudioContext
      innerAudioContext.pause()
      // console.log('录音暂停', '总时长：' + innerAudioContext.duration, '当前时长：' + innerAudioContext.currentTime)
      this.setData({
        // innerAudioContext,
        willReplay: false,
        willReplayingPause: true,
      })
    },
    /**
   * 录音进度条计算显示
   */
    audioProgressCal() {
      let innerAudioContext = this.data.innerAudioContext
      let audioDuration = this.data.audioDuration
      audioDuration = audioDuration === 0 ? 1 : audioDuration

      let audioProgress = (innerAudioContext.currentTime / audioDuration) * 100
      // console.log(audioProgress)
      /* Problem: 由于timer函数在结束开关打开后会默认多执行一步功能函数，
       * 导致在重新开始后，进度条会出现100%闪现
      */
      this.setData({
        audioProgress,
      })
    },
  }
})

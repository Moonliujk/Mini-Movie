// pages/index/index.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieId: 1,
    movieDetail: {},
    commentDetail: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovieInfo()
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
   * 获得随机电影信息
   */
  getMovieInfo() {
    let movieId = Math.floor(Math.random() * (15 - 1) + 1)
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
          this.getMovieComment(movieId)
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
   * 获得随机影评
   */
  getMovieComment(movieId) {
    qcloud.request({
      url: config.service.recommendCommentUnlogin,
      data: {
        movieId
      },
      success: res => {
        let data = res.data
        console.log('res', res)

        if (!data.code) {
          wx.showToast({
            title: '加载影评成功',
          })
          // console.log(data.data)
          let comment = data.data
          if (comment.length > 0) {
            this.setData({
              commentDetail: data.data[0]
            })
          }
          
        } else {
          wx.showToast({
            icon: 'none',
            title: '加载影评失败',
          })
        }
      },
      fail: res => {
        console.log(res)
        wx.showToast({
          icon: 'none',
          title: '加载影评失败',
        })
      }
    })
  },
  /**
   * 进行页面跳转
   */
  onTapNavigator(e) {
    let type = e.currentTarget.dataset.type
    let pages = '/pages/'

    switch(type) {
      case 'hotMovie':
        pages += 'hot_movie/hot_movie'
        break;
      case 'me':
        pages += 'me/me'
        break;
    }

    // 重定向到相应页面
    wx.navigateTo({
      url: pages,
    })
  },
  /**
   * 跳转至评论页面
   */
  onTapCommentList() {
    let movieId = this.data.movieId

    wx.navigateTo({
      url: `/pages/movie_comment/movie_comment?movieid=${movieId}`,
    })
  }
})
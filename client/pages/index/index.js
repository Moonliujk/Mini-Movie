// pages/index/index.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieId: 0,
    movieDetail: {},
    commentDetail: {
      userName: 'Leslie',
      userImage: '../../image/user.jpg',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovieInfo();
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
   * 获得电影信息以及电影随机的一条影评
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
      case 'coment':
        pages += 'comment/comment'
        break;
    }

    if (type === 'comment') {
      let movieId = this.data.movieId

      wx.showLoading({
        title: '正在跳转...',
      })

      wx.request({
        url: pages,
        data: {
          id: movieId
        },
        success: res => {
          wx.hideLoading()
          let data = res.data

          if (!data.code) {
            wx.showToast({
              title: '跳转成功',
            })
          } else {
            wx.showToast({
              title: '跳转失败',
            })
          }
        },
        fail: res => {
          wx.hideLoading()

          wx.showToast({
            title: '跳转失败',
          })
          console.log(res)
        }
      })
    } else {
      // 重定向到相应页面
      wx.navigateTo({
        url: pages,
      })
    }
  }
})
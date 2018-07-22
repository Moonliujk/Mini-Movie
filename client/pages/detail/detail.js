// pages/detail/detail.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieDetail: {
      id: 0,
      score: 8.5,
      year: 2005,
      title: '壁花少年',
      image: 'https://movie-1256948132.cos.ap-beijing.myqcloud.com/p1874816818.jpg',
      thumbnail: 'https://movie-1256948132.cos.ap-beijing.myqcloud.com/p1874816818.jpg',
      description: '查理（罗根·勒曼 Logan Lerman 饰）是个害羞和孤独的高中新生，拥有超越年龄的敏感和泪腺，总是默默观察身边的家人和朋友，是个典型的「壁花少年」。他的青春期充满各种挫折，先后经历了阿姨为给他买生日礼物去世、最好朋友自杀、受同侪排挤欺负、单恋没有回应等各种事情。然而查理还不是最惨的，因为和他一样被生活逼入墙角罚站的人实在太多。他幸运的拥有一个开明的老师和两个高年级的好友：叛逆娇俏的少女珊（艾玛·沃森 Emma Watson 饰）和自信满满的同志男生帕特里克（埃兹拉·米勒 Ezra Miller 饰），他们让查理明白了有时候不能永远旁观，必须要参与进来才能拥有属于自己的精彩。 ',
      category: '青春 / 成长 / 美国 / 爱情',
    },
    movieId: 1,
    isShowAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovieDetail(options.id)
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
  // 获取电影详情
  getMovieDetail(id) {
    wx.showLoading({
      title: '加载电影信息...',
    })

    qcloud.request({
      url: config.service.movieDetail + id,
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
            movieId: id
          })
        } else {
          wx.showToast({
            title: '加载电影失败',
          })

          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        }
      },
      fail: res => {
        wx.hideLoading()

        console.log(res)

        wx.showToast({
          title: '加载电影失败',
        })

        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      }
    })
  },
  // 显示/隐藏 更多内容
  onTapShowDetail() {
    let isShowAll = this.data.isShowAll

    this.setData({
      isShowAll: !isShowAll
    })
  },
  /**
   * 处理按钮单击事件
   */
  onTapHandleComment(e) {
    let type = e.currentTarget.dataset.type
    let movieId = this.data.movieId
    let pages = '/pages/'

    switch(type) {
      case 'showComment':
        pages += 'movie_comment/movie_comment'
        break
      case 'addComment':
        pages += 'edit_comment/edit_comment'
        break
    }

    wx.navigateTo({
      url: `${pages}?movieid=${movieId}`,
    })
    
  }
})